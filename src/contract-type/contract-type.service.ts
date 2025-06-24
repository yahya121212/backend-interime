import { Injectable } from '@nestjs/common';
import { CreateContractTypeDto } from './dto/create-contract-type.dto';
import { UpdateContractTypeDto } from './dto/update-contract-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractType } from './entities/contract-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContractTypeService {
  constructor(
    @InjectRepository(ContractType)
    private readonly contractTypeRepository: Repository<ContractType>,
  ) {}
  async create(createContractTypeDto: CreateContractTypeDto) {
    return await this.contractTypeRepository.create(createContractTypeDto);
  }

  async findAll() {
    return await this.contractTypeRepository.find();
  }

  async findOne(id: string): Promise<ContractType> {
    return await this.contractTypeRepository.findOne({
      where: { id },
    });
  }

  async save(contractType: ContractType) {
    await this.contractTypeRepository.save(contractType);
  }
}
