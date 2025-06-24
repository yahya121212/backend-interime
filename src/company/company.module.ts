import { forwardRef, Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyType } from './entities/company-type.entity';
import { Location } from 'src/location/entities/location.entity';
import { PersonModule } from 'src/person/person.module';
import { RedisModule } from 'src/redis/redis.module';
import { MessageModule } from 'src/message/message.module';
import { StatusModule } from 'src/status/status.module';
import { PostalCodeModule } from 'src/postal-code/postal-code.module';
import { CityModule } from 'src/city/city.module';
import { CompanyEmployeeModule } from 'src/company-employee/company-employee.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { SocialMediaModule } from 'src/social-media/social-media.module';
import { JobOfferModule } from 'src/job-offer/job-offer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanyType, Location]),
    StatusModule,
    forwardRef(() => PersonModule),
    // RedisModule,
    forwardRef(() => MessageModule),
    CityModule,
    PostalCodeModule,
    forwardRef(() => CompanyEmployeeModule),
    NotificationModule,
    ConversationModule,
    SocialMediaModule,
    StatusModule,
    forwardRef(() => JobOfferModule),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
