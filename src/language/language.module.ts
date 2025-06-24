import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { JobOfferLanguageModule } from 'src/job-offer-language/job-offer-language.module';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { JobOfferLanguage } from 'src/job-offer-language/entities/job-offer-language.entity';
import { JobOfferModule } from 'src/job-offer/job-offer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, JobOffer, JobOfferLanguage]),
    JobOfferLanguageModule,
  ],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
