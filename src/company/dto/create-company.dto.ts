import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateLocationDto } from 'src/location/dto/create-location.dto';

export class CreateCompanyDto {
  @IsString()
  
  name: string;
  @IsString()
  siret: string;
  @IsString()
  naf: string;
  @IsString()
  nafTitle: string;
  @IsString()
  category: string;
  @IsNumber()
  workforce: number;

  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}
