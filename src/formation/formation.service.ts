import { Injectable } from '@nestjs/common';
import { CreateFormationDto } from './dto/create-formation.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';
import { Formation } from './entities/formation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FormationService {
  constructor(
    @InjectRepository(Formation)
    private readonly formationRepo: Repository<Formation>,
  ) {}

  create(createFormationDto: CreateFormationDto) {
    return 'This action adds a new formation';
  }

  findAll() {
    return `This action returns all formation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formation`;
  }

  update(id: number, updateFormationDto: UpdateFormationDto) {
    return `This action updates a #${id} formation`;
  }

  remove(id: number) {
    return `This action removes a #${id} formation`;
  }

  async findOrCreate(candidateId: string, title: string): Promise<Formation> {
    // Attempt to find the Formation by candidate and title
    let formation = await this.formationRepo.findOne({
      where: {
        title,
        candidate: { id: candidateId },
      },
    });

    // If not found, create a new Formation instance
    if (!formation) {
      formation = new Formation();
    }

    return formation;
  }
}
