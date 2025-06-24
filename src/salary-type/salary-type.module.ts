import { Module } from '@nestjs/common';
import { SalaryTypeService } from './salary-type.service';
import { SalaryTypeController } from './salary-type.controller';
import { SalaryType } from './entities/salary-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryType])],
  controllers: [SalaryTypeController],
  providers: [SalaryTypeService],
  exports: [SalaryTypeService],
})
export class SalaryTypeModule {}
