import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaryTypeDto } from './create-salary-type.dto';

export class UpdateSalaryTypeDto extends PartialType(CreateSalaryTypeDto) {}
