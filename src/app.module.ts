import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import configuration, { EnvironmentVariables } from './config/configuration';
import { CandidateModule } from './candidate/candidate.module';
import { ActivityModule } from './activity/activity.module';
import { AgencyEmployeeModule } from './agency-employee/agency-employee.module';
import { AlertModule } from './alert/alert.module';
import { CityModule } from './city/city.module';
import { CompanyModule } from './company/company.module';
import { CompanyEmployeeModule } from './company-employee/company-employee.module';
import { ContractModule } from './contract/contract.module';
import { ContractTypeModule } from './contract-type/contract-type.module';
import { ConversationModule } from './conversation/conversation.module';
import { DocumentTypeModule } from './document-type/document-type.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { JobOfferModule } from './job-offer/job-offer.module';
import { LocationModule } from './location/location.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { PersonModule } from './person/person.module';
import { PersonalDocumentModule } from './personal-document/personal-document.module';
import { PositionModule } from './position/position.module';
import { PostalCodeModule } from './postal-code/postal-code.module';
import { QuestionModule } from './question/question.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { RegionModule } from './region/region.module';
import { ResponseModule } from './response/response.module';
import { RightModule } from './right/right.module';
import { SkillModule } from './skill/skill.module';
import { StatusModule } from './status/status.module';
import { SalaryTypeModule } from './salary-type/salary-type.module';
import { SubActivityModule } from './sub-activity/sub-activity.module';
import { FormationModule } from './formation/formation.module';
import { ExperienceModule } from './experience/experience.module';
import { LanguageModule } from './language/language.module';
import { DepartmentModule } from './department/department.module';
import { CountryModule } from './country/country.module';
import { JobModule } from './job/job.module';
import { SeedStatus } from './database/seeding/seed-status.entity';
import { SeederService } from './database/seeding/seeder';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccountGuard } from './common/guards/account.guard';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { MulterModule } from '@nestjs/platform-express';
import { FILE_UPLOAD_DIR } from './common/constants';
import { RedisModule } from './redis/redis.module';
import { InseeModule } from './insee/insee.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { JobOfferLanguageModule } from './job-offer-language/job-offer-language.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'uploads'),
      serveRoot: '/api/uploads',
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        return {
          ...configService.get('database'),
          autoLoadEntities: true,
          synchronize: true, // Just dev env
        };
      },
    }),
    TypeOrmModule.forFeature([SeedStatus]),
    MulterModule.register({
      dest: FILE_UPLOAD_DIR,
      limits: {
        fileSize: 1000 * 1000 * 10,
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 1000,
      },
    ]),
    ScheduleModule.forRoot(),
    PassportModule,
    CandidateModule,
    ActivityModule,
    AgencyEmployeeModule,
    AlertModule,
    CityModule,
    CompanyModule,
    CompanyEmployeeModule,
    ContractModule,
    ContractTypeModule,
    ConversationModule,
    DocumentTypeModule,
    EvaluationModule,
    JobOfferModule,
    LocationModule,
    MessageModule,
    NotificationModule,
    PersonModule,
    PersonalDocumentModule,
    PositionModule,
    PostalCodeModule,
    QuestionModule,
    QuestionnaireModule,
    RegionModule,
    ResponseModule,
    RightModule,
    SkillModule,
    StatusModule,
    SalaryTypeModule,
    SubActivityModule,
    FormationModule,
    ExperienceModule,
    LanguageModule,
    DepartmentModule,
    CountryModule,
    JobModule,
    AuthModule,
    // RedisModule,
    InseeModule,
    JobOfferLanguageModule,
    SocialMediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeederService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    { provide: APP_GUARD, useClass: AccountGuard },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
