import { Injectable } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
  ) {}
  create(createExperienceDto: CreateExperienceDto) {
    return 'This action adds a new experience';
  }

  findAll() {
    return `This action returns all experience`;
  }

  findOne(id: number) {
    return `This action returns a #${id} experience`;
  }

  update(id: number, updateExperienceDto: UpdateExperienceDto) {
    return `This action updates a #${id} experience`;
  }

  remove(id: number) {
    return `This action removes a #${id} experience`;
  }
  
  async findOrCreate(
    candidateId: string,
    companyName: string,
  ): Promise<Experience> {
    // Attempt to find the Experience by candidate and company name
    let experience = await this.experienceRepo.findOne({
      where: {
        companyName,
        candidate: { id: candidateId },
      },
    });

    // If not found, create a new Experience instance
    if (!experience) {
      experience = new Experience();
    }

    return experience;
  }
}
