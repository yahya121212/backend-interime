import { Injectable } from '@nestjs/common';
import { CreateSalaryTypeDto } from './dto/create-salary-type.dto';
import { UpdateSalaryTypeDto } from './dto/update-salary-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SalaryType } from './entities/salary-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalaryTypeService {
  constructor(
    @InjectRepository(SalaryType)
    private readonly salaryTypeRepo: Repository<SalaryType>,
  ) {}

  async create(createSalaryTypeDto: CreateSalaryTypeDto) {
    const newSalaryType = this.salaryTypeRepo.create(createSalaryTypeDto);
    return await this.salaryTypeRepo.save(newSalaryType);
  }

  async findOne(salary: number, type: string) {
    return await this.salaryTypeRepo.findOne({ where: { salary, type } });
  }
}
