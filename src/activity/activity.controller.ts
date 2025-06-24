import { Controller, Get } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getAllActivities(): Promise<Activity[]> {
    return this.activityService.getAllActivities();
  }
}
