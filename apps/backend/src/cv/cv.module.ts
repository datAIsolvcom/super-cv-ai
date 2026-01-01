import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { BullModule } from '@nestjs/bullmq';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { CvProcessor } from './cv.processor'; 
import { AiIntegrationService } from './ai-integration.service'; 
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cv_queue',
    }),
    HttpModule,
    PrismaModule,
  ],
  controllers: [CvController],
  providers: [
    CvService, 
    PrismaService, 
    CvProcessor, 
    AiIntegrationService
  ],
  exports: [CvService],
})
export class CvModule {}