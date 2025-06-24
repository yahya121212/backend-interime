import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ContractTypeService } from './contract-type.service';
import { CreateContractTypeDto } from './dto/create-contract-type.dto';

@Controller('contract-types')
export class ContractTypeController {
  constructor(private readonly contractTypeService: ContractTypeService) {}

  @Post()
  create(@Body() createContractTypeDto: CreateContractTypeDto) {
    return this.contractTypeService.create(createContractTypeDto);
  }

  @Get()
  async findAll() {
    return await this.contractTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractTypeService.findOne(id);
  }
}
