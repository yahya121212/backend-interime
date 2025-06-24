import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto) {
    const skill = this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async findAll() {
    return await this.skillRepository.find();
  }

  async findOne(id: string) {
    return await this.skillRepository.findOne({ where: { id } });
  }
  
  async findOneByName(name: string) {
    return await this.skillRepository.findOne({ where: { name } });
  }

  async save(skill: Skill) {
    await this.skillRepository.save(skill);
  }
}
