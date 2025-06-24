import { IsOptional, IsString } from 'class-validator';

export class createSocialMediaDto {
  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  linkedIn?: string;
}
