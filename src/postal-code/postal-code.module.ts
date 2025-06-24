import { Module } from '@nestjs/common';
import { PostalCodeService } from './postal-code.service';
import { PostalCodeController } from './postal-code.controller';
import { PostalCode } from './entities/postal-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PostalCode])],
  controllers: [PostalCodeController],
  providers: [PostalCodeService],
  exports: [PostalCodeService],
})
export class PostalCodeModule {}
