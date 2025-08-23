import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageBuilder } from './entities/page-builder.entity';
import { PageBuilderService } from './page-builder.service';
import { PageBuilderController } from './page-builder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PageBuilder])],
  providers: [PageBuilderService],
  controllers: [PageBuilderController],
  exports: [TypeOrmModule, PageBuilderService], // <-- make public

})
export class PageBuilderModule {}