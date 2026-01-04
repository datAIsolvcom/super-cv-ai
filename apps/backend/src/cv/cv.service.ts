import { Injectable, Logger, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';
import { CvStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { validateUploadedFile } from './utils/file-validation.util';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('cv_queue') private cvQueue: Queue,
  ) { }

  async processCvUpload(
    file: Express.Multer.File,
    dto: AnalyzeCvDto,
    userId?: string
  ) {

    const { sanitizedName, hash } = validateUploadedFile(file);

    this.logger.log(`Processing file: ${sanitizedName} (hash: ${hash.slice(0, 16)}...)`);

    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('User account not found.');

      if (user.credits <= 0) {
        throw new BadRequestException('Insufficient credits. Please upgrade your plan.');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }


    const uniqueFilename = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);

    const cv = await this.prisma.cV.create({
      data: {
        userId: userId || null,
        fileUrl: filePath,
        status: CvStatus.PENDING,
        jobContext: {
          text: dto.jobDescriptionText,
          url: dto.jobDescriptionUrl
        } as any,
      },
    });


    const today = new Date().toISOString().split('T')[0];

    await this.cvQueue.add(
      'analyze-job',
      {
        cvId: cv.id,
        filePath: filePath,
        jobContext: {
          text: dto.jobDescriptionText,
          url: dto.jobDescriptionUrl,
        },

        currentDate: today,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );

    this.logger.log(`CV ${cv.id} queued for Analysis (Date: ${today}).`);

    return { cvId: cv.id, status: 'PENDING' };
  }

  async claimCv(cvId: string, userId: string) {
    const cv = await this.prisma.cV.findUnique({ where: { id: cvId } });
    if (!cv) throw new NotFoundException('CV not found');

    if (cv.userId && cv.userId !== userId) {
      throw new BadRequestException('This CV belongs to another user.');
    }

    if (cv.userId === userId) {
      return { status: 'ALREADY_OWNED', message: 'CV already unlocked.' };
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    if (user.credits <= 0) {
      throw new BadRequestException('Credits exhausted. Please upgrade to unlock results.');
    }

    await this.prisma.$transaction([
      this.prisma.cV.update({
        where: { id: cvId },
        data: { userId: userId }
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      })
    ]);

    this.logger.log(`CV ${cvId} claimed by User ${userId}`);

    return { status: 'CLAIMED', remainingCredits: user.credits - 1 };
  }

  async customizeCv(id: string, mode: string) {
    const cv = await this.prisma.cV.findUnique({ where: { id } });
    if (!cv) throw new NotFoundException('CV not found');
    if (!cv.fileUrl || !fs.existsSync(cv.fileUrl)) {
      throw new NotFoundException('Physical CV file not found');
    }

    let contextData: any = "";
    if (mode === 'analysis') {
      if (!cv.analysisResult) {
        throw new BadRequestException("Analysis result not found. Please analyze first.");
      }
      contextData = cv.analysisResult;
    } else {
      contextData = cv.jobContext;
    }


    const today = new Date().toISOString().split('T')[0];

    await this.cvQueue.add(
      'customize-job',
      {
        cvId: cv.id,
        mode: mode,
        filePath: cv.fileUrl,
        contextData: contextData,
        currentDate: today,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      }
    );

    return { message: 'Customization queued', status: 'PROCESSING' };
  }


  async findOne(id: string) {
    return this.prisma.cV.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        analysisResult: true,
        aiDraft: true,
        originalData: true,
        jobContext: true,
        createdAt: true,
        updatedAt: true,

      },
    });
  }


  async findOneWithFile(id: string) {
    return this.prisma.cV.findUnique({
      where: { id },
      select: {
        id: true,
        fileUrl: true,
        status: true,
      },
    });
  }
}