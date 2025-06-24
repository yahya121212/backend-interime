import { IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  postalCode: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;
}
