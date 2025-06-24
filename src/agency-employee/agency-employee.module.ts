import { Module } from '@nestjs/common';
import { AgencyEmployeeService } from './agency-employee.service';
import { AgencyEmployeeController } from './agency-employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyEmployee } from './entities/agencyEmployee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgencyEmployee])],
  controllers: [AgencyEmployeeController],
  providers: [AgencyEmployeeService],
})
export class AgencyEmployeeModule {}
