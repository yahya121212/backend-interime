import { Injectable } from '@nestjs/common';
import { Department } from './entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Region } from 'src/region/entities/region.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}
  async create(dep: { name: string; region: Region }) {
    const department = this.departmentRepo.create(dep);
    return await this.departmentRepo.save(department);
  }

  async findAllByNameLike(name: string) {
    return await this.departmentRepo.find({
      where: { name: ILike(`${name}%`) },
      relations: ['region'],
    });
  }

  async findOneByName(name: string): Promise<Department | null> {
    return await this.departmentRepo.findOne({ where: { name } });
  }
}
