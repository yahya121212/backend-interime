import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostalCode } from './entities/postal-code.entity';
import { Repository } from 'typeorm';
import { City } from 'src/city/entities/city.entity';

@Injectable()
export class PostalCodeService {
  constructor(
    @InjectRepository(PostalCode)
    private readonly postalcodeRepo: Repository<PostalCode>,
  ) {}
  async create(zip: { code: string; cities: City[] }) {
    const code = this.postalcodeRepo.create({
      code: zip.code,
      cities: zip.cities,
    });

    return await this.postalcodeRepo.save(code);
  }

  async findAll() {
    return await this.postalcodeRepo.find();
  }

  async findOneByCode(code: string): Promise<PostalCode | null> {
    return await this.postalcodeRepo.findOne({
      where: { code },
      relations: ['cities', 'cities.department', 'cities.department.region'],
    });
  }

  async save(code: PostalCode) {
    await this.postalcodeRepo.save(code);
  }
}
