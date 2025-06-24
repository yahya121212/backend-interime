import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PersonModule } from 'src/person/person.module';
import { JobOfferModule } from 'src/job-offer/job-offer.module';
import { StatusModule } from 'src/status/status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    forwardRef(() => PersonModule),
    forwardRef(() => JobOfferModule),
    StatusModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, EmailService],
  exports: [EmailService, MessageService],
})
export class MessageModule {}
