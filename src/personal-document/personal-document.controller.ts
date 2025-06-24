import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PersonalDocumentService } from './personal-document.service';
import { CreatePersonalDocumentDto } from './dto/create-personal-document.dto';
import { UpdatePersonalDocumentDto } from './dto/update-personal-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_UPLOAD_DIR } from 'src/common/constants';
import { docFileFilter, generatedFileName } from './document.utils';

@Controller('p-document')
export class PersonalDocumentController {
  constructor(
    private readonly personalDocumentService: PersonalDocumentService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: generatedFileName,
        destination: FILE_UPLOAD_DIR,
      }),
      limits: {
        fileSize: 1000 * 1000 * 1,
      },
      fileFilter: docFileFilter,
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Body() dto) {
    return { fileName: file.filename, size: file.size, dto };
  }

}
