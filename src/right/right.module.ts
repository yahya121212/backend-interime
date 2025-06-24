import { Module } from '@nestjs/common';
import { RightService } from './right.service';
import { RightController } from './right.controller';
import { Right } from './entities/right.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Right])],
  controllers: [RightController],
  providers: [RightService],
})
export class RightModule {}
