import { Module } from '@nestjs/common';
import { SubActivityService } from './sub-activity.service';
import { SubActivityController } from './sub-activity.controller';
import { SubActivity } from './entities/sub-activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SubActivity])],
  controllers: [SubActivityController],
  providers: [SubActivityService],
  exports: [SubActivityService],
})
export class SubActivityModule {}
