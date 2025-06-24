import { Module } from '@nestjs/common';
import { JobOfferLanguageService } from './job-offer-language.service';
import { JobOfferLanguageController } from './job-offer-language.controller';
import { JobOfferLanguage } from './entities/job-offer-language.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Language } from 'src/language/entities/language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOfferLanguage, JobOffer, Language]),
  ],
  controllers: [JobOfferLanguageController],
  providers: [JobOfferLanguageService],
  exports: [JobOfferLanguageService],
})
export class JobOfferLanguageModule {}
