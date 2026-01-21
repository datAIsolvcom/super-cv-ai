import {
    Injectable,
    Logger,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutDto, CREDIT_PACKAGES } from './dto/payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private readonly mayarApiUrl = 'https://api.mayar.id/hl/v1';
    private readonly mayarApiKey = process.env.MAYAR_API_KEY;
    private readonly mayarWebhookToken = process.env.MAYAR_WEBHOOK_TOKEN;

    constructor(private prisma: PrismaService) { }

    getPackages() {
        return CREDIT_PACKAGES;
    }

    async createCheckout(userId: string, dto: CreateCheckoutDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const pkg = CREDIT_PACKAGES.find((p) => p.id === dto.packageId);
        if (!pkg) {
            throw new BadRequestException('Invalid package selected');
        }

        const transaction = await this.prisma.creditTransaction.create({
            data: {
                userId,
                amount: pkg.credits,
                priceIdr: pkg.priceIdr,
                status: 'PENDING',
            },
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectUrl = dto.redirectUrl || `${frontendUrl}/profile?payment=success&txn=${transaction.id}`;
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 24);

        const requestBody = {
            name: user.name || user.email.split('@')[0],
            email: user.email,
            amount: pkg.priceIdr,
            mobile: '08123456789',
            redirectURL: redirectUrl,
            description: `SuperCV Credits - ${pkg.credits} credit(s) - TXN:${transaction.id}`,
            expiredAt: expiredAt.toISOString(),
        };

        this.logger.log(`Creating Mayar payment: ${JSON.stringify(requestBody)}`);

        const response = await fetch(`${this.mayarApiUrl}/payment/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.mayarApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        this.logger.log(`Mayar response: ${JSON.stringify(result)}`);

        if (result.statusCode !== 200 && !result.data?.link) {
            this.logger.error('Mayar API error:', JSON.stringify(result));
            throw new BadRequestException(`Payment failed: ${result.message || result.messages || 'Unknown error'}`);
        }

        await this.prisma.creditTransaction.update({
            where: { id: transaction.id },
            data: { mayarPaymentId: result.data.id },
        });

        this.logger.log(`Payment link created for user ${userId}, transaction ${transaction.id}`);

        return {
            paymentUrl: result.data.link,
            transactionId: transaction.id,
        };
    }

    async handleWebhook(payload: any, signature?: string) {
        if (this.mayarWebhookToken && signature) {
            const expectedSignature = crypto
                .createHmac('sha256', this.mayarWebhookToken)
                .update(JSON.stringify(payload))
                .digest('hex');

            if (signature !== expectedSignature) {
                this.logger.warn('Invalid webhook signature');
                throw new UnauthorizedException('Invalid webhook signature');
            }
        }

        this.logger.log(`Webhook received: ${payload.event} - ${payload.id}`);

        if (payload.event === 'payment.success' || payload.status === 'success') {
            const mayarPaymentId = payload.id;
            const transaction = await this.prisma.creditTransaction.findUnique({
                where: { mayarPaymentId },
            });

            if (!transaction) {
                const metadata = payload.metadata;
                if (metadata?.transactionId) {
                    return this.processPaymentSuccess(metadata.transactionId);
                }
                this.logger.warn(`Transaction not found for Mayar payment ${mayarPaymentId}`);
                return { status: 'ignored', message: 'Transaction not found' };
            }

            if (transaction.status === 'COMPLETED') {
                return { status: 'already_processed' };
            }

            return this.processPaymentSuccess(transaction.id);
        }

        return { status: 'event_ignored', event: payload.event };
    }

    private async processPaymentSuccess(transactionId: string) {
        const transaction = await this.prisma.creditTransaction.findUnique({
            where: { id: transactionId },
        });

        if (!transaction || transaction.status === 'COMPLETED') {
            return { status: 'already_processed' };
        }

        await this.prisma.$transaction([
            this.prisma.creditTransaction.update({
                where: { id: transactionId },
                data: { status: 'COMPLETED' },
            }),
            this.prisma.user.update({
                where: { id: transaction.userId },
                data: { credits: { increment: transaction.amount } },
            }),
        ]);

        this.logger.log(`Payment success: Added ${transaction.amount} credits to user ${transaction.userId}`);

        return { status: 'success', creditsAdded: transaction.amount };
    }

    async getUserTransactions(userId: string) {
        return this.prisma.creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }
}
