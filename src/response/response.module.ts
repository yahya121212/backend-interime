import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { Response } from './entities/response.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Response])],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}
