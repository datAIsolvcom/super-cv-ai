import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiIntegrationService } from './ai-integration.service'; 
import { CvStatus } from '@prisma/client';
import * as fs from 'fs';

@Processor('cv_queue')
export class CvProcessor extends WorkerHost {
  private readonly logger = new Logger(CvProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiIntegrationService, 
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing Job [${job.name}] ID: ${job.id}`);

    try {
      switch (job.name) {
        case 'analyze-job':
          return await this.handleAnalyze(job);
        case 'customize-job':
          return await this.handleCustomize(job);
        default:
          throw new Error(`Unknown job name: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(`Job ${job.id} Failed: ${error.message}`);
      throw error;
    }
  }

  private async handleAnalyze(job: Job) {

    const { cvId, filePath, jobContext, currentDate } = job.data;

    try {
      await this.prisma.cV.update({ where: { id: cvId }, data: { status: CvStatus.PROCESSING } });

      if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
      const fileBuffer = fs.readFileSync(filePath);
      
  
      const result = await this.aiService.analyzeCv(
        fileBuffer, 
        'resume.pdf', 
        jobContext,
        currentDate 
      );

      await this.prisma.cV.update({
        where: { id: cvId },
        data: {
          status: CvStatus.COMPLETED,
          analysisResult: result.analysis,
          originalData: result.cv_data,
        },
      });

    } catch (error) {
      await this.prisma.cV.update({ where: { id: cvId }, data: { status: CvStatus.FAILED } });
      throw error;
    }
  }

  private async handleCustomize(job: Job) {
    
    const { cvId, mode, filePath, contextData, currentDate } = job.data;

    try {
      await this.prisma.cV.update({ where: { id: cvId }, data: { status: CvStatus.PROCESSING } });

      if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
      const fileBuffer = fs.readFileSync(filePath);
      
     
      const aiDraft = await this.aiService.customizeCv(
        fileBuffer,
        'resume.pdf',
        mode,
        contextData,
        currentDate 
      );

      await this.prisma.cV.update({
        where: { id: cvId },
        data: {
          status: CvStatus.COMPLETED,
          aiDraft: aiDraft,
        },
      });

    } catch (error) {
      await this.prisma.cV.update({ where: { id: cvId }, data: { status: CvStatus.FAILED } });
      throw error;
    }
  }
}