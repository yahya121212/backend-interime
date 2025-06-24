import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { ILike, Repository } from 'typeorm';
import { Department } from 'src/department/entities/department.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}
  async create(cityDto: { name: string; department: Department }) {
    const city = this.cityRepository.create(cityDto);
    return await this.cityRepository.save(city);
  }

  async findAll() {
    return await this.cityRepository.find();
  }

  async findOne(id: string) {
    return await this.cityRepository.findOne({
      where: { id },
      relations: ['department', 'department.region'],
    });
  }

  async findOneByName(name: string): Promise<City> {
    return await this.cityRepository.findOne({
      where: { name },
      relations: ['department', 'department.region'],
    });
  }

  async findAllByNameLike(name: string) {
    return await this.cityRepository.find({
      where: { name: ILike(`${name}%`) },
      relations: ['department', 'department.region'],
    });
  }
}
