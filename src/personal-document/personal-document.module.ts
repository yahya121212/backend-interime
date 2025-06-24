import { Module } from '@nestjs/common';
import { PersonalDocumentService } from './personal-document.service';
import { PersonalDocumentController } from './personal-document.controller';
import { PersonalDocument } from './entities/personal-document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalDocument])],
  controllers: [PersonalDocumentController],
  providers: [PersonalDocumentService],
})
export class PersonalDocumentModule {}
