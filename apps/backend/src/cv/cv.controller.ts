import { 
  Body, 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  Headers,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyze(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AnalyzeCvDto,
    @Headers('userId') userIdHeader: string 
  ) {

    const userId = userIdHeader && userIdHeader !== 'null' ? userIdHeader : null;

    return this.cvService.processCvUpload(file, dto, userId);
  }
}