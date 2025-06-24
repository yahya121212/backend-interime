import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { ILike, Repository } from 'typeorm';
import { retry } from 'rxjs';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}
  async create(createLanguageDto: CreateLanguageDto) {
    const lang = this.languageRepository.create(createLanguageDto);
    return await this.languageRepository.save(lang);
  }

  async findAll() {
    return await this.languageRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} language`;
  }

  update(id: number, updateLanguageDto: UpdateLanguageDto) {
    return `This action updates a #${id} language`;
  }

  remove(id: number) {
    return `This action removes a #${id} language`;
  }

  async findOneByName(name: string) {
    return await this.languageRepository.findOne({
      where: { name: ILike(name) }, // Case-insensitive search
    });
  }
}
