import { IsOptional, IsString } from 'class-validator';

export class FilterCandidatesDto {
  @IsOptional()
  @IsString()
  profileTiltle?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  status?: string | null;
}
