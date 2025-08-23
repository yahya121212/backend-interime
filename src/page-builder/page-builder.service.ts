import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageBuilder } from './entities/page-builder.entity';

@Injectable()
export class PageBuilderService {
  constructor(
    @InjectRepository(PageBuilder)
    private repo: Repository<PageBuilder>,
  ) {}

  create(title: string, data: any) {
    const page = this.repo.create({ title, data });
    return this.repo.save(page);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, data: Partial<PageBuilder>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }
}