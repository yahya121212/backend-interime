import { IsString } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  context: string;
}
