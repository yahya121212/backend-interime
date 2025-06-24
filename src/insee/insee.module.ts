import { Module } from '@nestjs/common';
import { InseeService } from './insee.service';
import { InseeController } from './insee.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [InseeController],
  providers: [InseeService],
  exports: [InseeService],
})
export class InseeModule {}
