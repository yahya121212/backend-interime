import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  emailHasChanged?: boolean = false;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  facebook?: string | null;

  @IsString()
  @IsOptional()
  instagram?: string | null;

  @IsString()
  @IsOptional()
  linkedIn?: string | null;

  @IsOptional()
  coverImage;
  @IsOptional()
  image;
}
