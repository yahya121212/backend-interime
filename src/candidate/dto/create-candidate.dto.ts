import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  
  @IsString()
  @IsOptional()
  readonly phone: string;
  
  @IsOptional()
  @IsDateString()
  readonly birthDate?: Date;
  
  @IsString()
  readonly profileTitle: string;

}
