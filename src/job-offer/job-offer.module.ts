import { forwardRef, Module } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { JobOfferController } from './job-offer.controller';
import { JobOffer } from './entities/job-offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from 'src/company/company.module';
import { StatusModule } from 'src/status/status.module';
import { ContractTypeModule } from 'src/contract-type/contract-type.module';
import { JobModule } from 'src/job/job.module';
import { CityModule } from 'src/city/city.module';
import { SkillModule } from 'src/skill/skill.module';
import { JobOfferLanguageModule } from 'src/job-offer-language/job-offer-language.module';
import { LanguageModule } from 'src/language/language.module';
import { JobOfferLanguage } from 'src/job-offer-language/entities/job-offer-language.entity';
import { Language } from 'src/language/entities/language.entity';
import { SalaryTypeModule } from 'src/salary-type/salary-type.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { CandidateJobOffer } from './entities/CandidateJobOffer.entity';
import { PersonModule } from 'src/person/person.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobOffer,
      JobOfferLanguage,
      Language,
      CandidateJobOffer,
    ]),
    forwardRef(() => CompanyModule),
    StatusModule,
    forwardRef(() => PersonModule),
    ContractTypeModule,
    JobModule,
    CityModule,
    SkillModule,
    LanguageModule,
    JobOfferLanguageModule,
    SalaryTypeModule,
    forwardRef(() => CandidateModule),
    forwardRef(() => MessageModule),
  ],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [JobOfferService],
})
export class JobOfferModule {}
