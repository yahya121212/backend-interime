import { PartialType } from '@nestjs/mapped-types';
import { CreateRightDto } from './create-right.dto';

export class UpdateRightDto extends PartialType(CreateRightDto) {}
