import { Module } from '@nestjs/common';
import { ContractTypeService } from './contract-type.service';
import { ContractTypeController } from './contract-type.controller';
import { ContractType } from './entities/contract-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ContractType])],
  controllers: [ContractTypeController],
  providers: [ContractTypeService],
  exports: [ContractTypeService],
})
export class ContractTypeModule {}
