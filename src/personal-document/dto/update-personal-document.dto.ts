import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalDocumentDto } from './create-personal-document.dto';

export class UpdatePersonalDocumentDto extends PartialType(CreatePersonalDocumentDto) {}
