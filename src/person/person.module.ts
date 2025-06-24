import { forwardRef, Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Person } from './entities/person.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationModule } from 'src/verification/verification.module';
import { MessageModule } from 'src/message/message.module';
import { StatusModule } from 'src/status/status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    VerificationModule,
    forwardRef(() => MessageModule),
    StatusModule,
  ],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
