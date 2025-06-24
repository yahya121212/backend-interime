import { PartialType } from '@nestjs/mapped-types';
import { createSocialMediaDto } from './create-socila-media.dto';

export class UpdateSocialMediaDto extends PartialType(createSocialMediaDto) {}
