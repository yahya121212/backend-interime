import { IsNumber, IsString } from 'class-validator';

export class CreateSalaryTypeDto {
  @IsNumber()
  salary: number = 0;
  @IsString()
  type: string;
}
