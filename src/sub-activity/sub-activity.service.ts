import { Injectable } from '@nestjs/common';
import { UpdateSubActivityDto } from './dto/update-sub-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubActivity } from './entities/sub-activity.entity';
import { Repository } from 'typeorm';
import { Job } from 'src/job/entities/job.entity';
import { Activity } from 'src/activity/entities/activity.entity';

@Injectable()
export class SubActivityService {
  constructor(
    @InjectRepository(SubActivity)
    private readonly subActivityRepo: Repository<SubActivity>,
  ) {}

  async create(createSubActivityDto: {
    name: string;
    jobs?: Job[];
    activity?: Activity;
  }) {
    const subActivity = this.subActivityRepo.create(createSubActivityDto);
    return await this.subActivityRepo.save(subActivity);
  }

  async findAll() {
    return await this.subActivityRepo.find();
  }

  async findOne(id: string) {
    return await this.subActivityRepo.findOne({
      where: { id },
      relations: ['activity'],
    });
  }

  async findOneByName(name: string): Promise<SubActivity | null> {
    return await this.subActivityRepo.findOne({
      where: { name },
      relations: ['activity'],
    });
  }
}
