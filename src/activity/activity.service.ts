import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { SubActivity } from 'src/sub-activity/entities/sub-activity.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}
  async create(activityDto: {
    name: string;
    subActivities?: SubActivity[];
    companies?: Company[];
  }) {
    const activity = this.activityRepository.create(activityDto);
    return await this.activityRepository.save(activity);
  }

  async findOneByName(name: string): Promise<Activity | null> {
    return await this.activityRepository.findOne({ where: { name } });
  }

  async getAllActivities(): Promise<Activity[]> {
    return this.activityRepository.find({
      relations: ['subActivities'],
    });
  }
}
