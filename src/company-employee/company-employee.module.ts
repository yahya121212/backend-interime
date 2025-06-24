import { forwardRef, Module } from '@nestjs/common';
import { CompanyEmployeeService } from './company-employee.service';
import { CompanyEmployeeController } from './company-employee.controller';
import { CompanyEmployee } from './entities/company-employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusModule } from 'src/status/status.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEmployee]),
    StatusModule,
    forwardRef(() => MessageModule),
  ],
  controllers: [CompanyEmployeeController],
  providers: [CompanyEmployeeService],
  exports: [CompanyEmployeeService],
})
export class CompanyEmployeeModule {}
