import { Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { LocationService } from 'src/location/location.service';
import { LocationModule } from 'src/location/location.module';
import { Location } from 'src/location/entities/location.entity';
import { PostalCode } from 'src/postal-code/entities/postal-code.entity';
import { Job } from 'src/job/entities/job.entity';
import { JobModule } from 'src/job/job.module';
import { PersonalDocument } from 'src/personal-document/entities/personal-document.entity';
import { PersonalDocumentService } from 'src/personal-document/personal-document.service';
import { City } from 'src/city/entities/city.entity';
import { StatusModule } from 'src/status/status.module';
import { PostalCodeModule } from 'src/postal-code/postal-code.module';
import { CityModule } from 'src/city/city.module';
import { CandidateSkill } from 'src/skill/entities/candidate-skill.entity';
import { CandidateLanguage } from 'src/skill/entities/candidate-luanguage.entity';
import { LanguageModule } from 'src/language/language.module';
import { SkillModule } from 'src/skill/skill.module';
import { FormationModule } from 'src/formation/formation.module';
import { ExperienceModule } from 'src/experience/experience.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Candidate,
      Location,
      PostalCode,
      Job,
      PersonalDocument,
      City,
      CandidateSkill,
      CandidateLanguage,
    ]),
    LocationModule,
    JobModule,
    StatusModule,
    PostalCodeModule,
    CityModule,
    LanguageModule,
    SkillModule,
    MessageModule,
    FormationModule,
    ExperienceModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService, LocationService, PersonalDocumentService],
  exports: [CandidateService],
})
export class CandidateModule {}
