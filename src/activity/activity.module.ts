import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { JobService } from 'src/job/job.service';
import { Job } from 'src/job/entities/job.entity';
import { SubActivityModule } from 'src/sub-activity/sub-activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Job]), SubActivityModule],
  controllers: [ActivityController],
  providers: [ActivityService, JobService],
  exports: [ActivityService],
})
export class ActivityModule {}
