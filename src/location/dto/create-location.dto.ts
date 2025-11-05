import { IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsOptional()
  postalCode: any;


  @IsOptional()
  @IsString()
  city: any;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;
}
