import { IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  postalCode: any;

  @IsString()
  city: any;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;
}
