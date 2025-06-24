import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async create(createStatusDto: CreateStatusDto) {
    const newStatus = this.statusRepository.create(createStatusDto);

    return await this.statusRepository.save(newStatus);
  }

  findAll() {
    return `This action returns all status`;
  }

  async findOne(id: string) {
    return await this.statusRepository.findOne({ where: { id } });
  }

  async findStatus(name: string, context: string): Promise<Status | null> {
    return await this.statusRepository.findOne({
      where: { name, context },
    });
  }

  async getAllCompanyStatus() {
    return await this.statusRepository.find({
      where: {
        context: 'Company',
        name: Not(In(['Pending', 'Rejected'])),
      },
    });
  }

  async getAllProjectsStatus() {
    return await this.statusRepository.find({
      where: {
        context: 'JobOffer',
      },
    });
  }
}
