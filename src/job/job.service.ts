import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { SubActivityService } from 'src/sub-activity/sub-activity.service';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly subActivityService: SubActivityService,
  ) {}

  async create(name: string) {
    const job = this.jobRepository.create({ name });
    return await this.jobRepository.save(job);
  }

  async findAll() {
    return await this.jobRepository.find({
      relations: ['subActivity', 'subActivity.activity'],
    });
  }

  async findOne(id: string) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['subActivity', 'subActivity.activity'],
    });

    if (!job) {
      throw new NotFoundException('this job is not found');
    }

    return job;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }

  async findOneByName(name: string): Promise<Job> {
    return await this.jobRepository.findOne({ where: { name } });
  }

  async findOrCreateJobByNameAndSubActivity(
    name: string,
    subActivityName: string,
  ): Promise<Job> {
    let job = await this.jobRepository.findOne({
      where: { name, subActivity: { name: subActivityName } },
      relations: ['subActivity'],
    });

    if (job) {
      return job;
    }

    const subActivity =
      await this.subActivityService.findOneByName(subActivityName);
    if (!subActivity) {
      throw new NotFoundException(`SubActivity is not found`);
    }

    job = this.jobRepository.create({
      name,
      subActivity,
    });
    return await this.jobRepository.save(job);
  }

  async save(job: Job) {
    await this.jobRepository.save(job);
  }
}
