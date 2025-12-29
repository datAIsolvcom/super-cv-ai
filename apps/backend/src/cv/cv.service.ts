import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';
import { CvStatus } from '@prisma/client';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('cv_queue') private cvQueue: Queue,
  ) {}

  async processCvUpload(
    file: Express.Multer.File, 
    dto: AnalyzeCvDto, 
    userId: string | null
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }


    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user && user.credits <= 0) {
        throw new BadRequestException('Insufficient credits');
      }
  
      if (user) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: 1 } },
        });
      }
    }


    const mockFileKey = `uploads/${Date.now()}_${file.originalname}`;


    const cv = await this.prisma.cV.create({
      data: {
        userId: userId, 
        fileUrl: mockFileKey,
        status: CvStatus.PENDING,
        jobContext: {
          text: dto.jobDescriptionText,
          url: dto.jobDescriptionUrl
        } as any, 
      },
    });

    await this.cvQueue.add(
      'analyze_job',
      {
        cvId: cv.id,
        fileKey: mockFileKey,
        jobContext: {
          text: dto.jobDescriptionText,
          url: dto.jobDescriptionUrl,
        },
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );

    this.logger.log(`CV ${cv.id} queued for analysis. User: ${userId || 'Guest'}`);

    return { 
      cvId: cv.id, 
      status: 'QUEUED', 
      creditsRemaining: userId ? 'calculated_later' : 'N/A' 
    };
  }
}