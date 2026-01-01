import { 
  Body, 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  Headers, 
  Get, 
  Param, 
  UnauthorizedException,
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
    
    const userId = userIdHeader && userIdHeader !== 'null' && userIdHeader !== 'undefined' 
      ? userIdHeader 
      : undefined;

    
    return this.cvService.processCvUpload(file, dto, userId);
  }

  
  @Post(':id/claim')
  async claim(
    @Param('id') id: string,
    @Headers('userId') userId: string
  ) {
      if (!userId) throw new UnauthorizedException('Wajib login untuk mengklaim hasil.');
      return this.cvService.claimCv(id, userId);
  }

 
  @Get(':id')
  async getCv(@Param('id') id: string) {
    return this.cvService.findOne(id);
  }

 
  @Post(':id/customize')
  async customizeCv(
    @Param('id') id: string, 
    @Body('mode') mode: string
  ) {
    if (!mode) {
        throw new BadRequestException("Mode is required ('analysis' or 'job_desc')");
    }
    
    
    return this.cvService.customizeCv(id, mode);
  }
}