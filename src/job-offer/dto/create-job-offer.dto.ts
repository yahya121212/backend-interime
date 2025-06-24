import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { City } from 'src/city/entities/city.entity';
import { Company } from 'src/company/entities/company.entity';
import { ContractType } from 'src/contract-type/entities/contract-type.entity';
import { Job } from 'src/job/entities/job.entity';
import { Status } from 'src/status/entities/status.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { SalaryType } from 'src/salary-type/entities/salary-type.entity';

export class CreateJobOfferDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  seniority?: string;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;

  @IsNumber()
  expectedDuration: number;

  @IsString()
  timeUnit: string;

  @IsOptional()
  city: City;

  @IsOptional()
  contractType: ContractType;

  @IsOptional()
  job: Job;

  @IsOptional()
  status: Status;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsOptional()
  company: Company;

  @IsOptional()
  salaryType: SalaryType;

  skills: Skill[];
}
