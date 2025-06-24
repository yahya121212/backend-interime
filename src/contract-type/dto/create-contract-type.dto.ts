import { IsBoolean, IsString } from 'class-validator';

export class CreateContractTypeDto {
  @IsString()
  description: string;

  @IsBoolean()
  isRenewable: boolean;
}
