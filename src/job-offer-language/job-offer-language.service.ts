import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobOfferLanguage } from './entities/job-offer-language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobOfferLanguageService {
  constructor(
    @InjectRepository(JobOfferLanguage)
    private readonly jobOfferLangRepo: Repository<JobOfferLanguage>,
  ) {}
  async create(createJobOfferLanguageDto) {
    const offerLang = this.jobOfferLangRepo.create(createJobOfferLanguageDto);
    return this.jobOfferLangRepo.save(offerLang);
  }

  findAll() {
    return `This action returns all jobOfferLanguage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobOfferLanguage`;
  }

  update(id: number, updateJobOfferLanguageDto) {
    return `This action updates a #${id} jobOfferLanguage`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobOfferLanguage`;
  }
}
