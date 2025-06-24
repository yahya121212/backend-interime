import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { Department } from 'src/department/entities/department.entity';
import { Country } from 'src/country/entities/country.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}
  async create(region: {
    name: string;
    country: Country;
    departments?: Department[];
  }) {
    const newRegion = this.regionRepository.create(region);
    return await this.regionRepository.save(newRegion);
  }

  async findOneByName(name: string): Promise<Region | null> {
    return await this.regionRepository.findOne({
      where: { name },
    });
  }

  async findAllByNameLike(name: string) {
    return await this.regionRepository.find({
      where: { name: ILike(`%${name}%`) },
    });
  }
}
