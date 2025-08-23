import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageBuilder } from './entities/page-builder.entity';
import { PageBuilderController } from './pageBuilder.controller';
import { PageBuilderService } from 'src/page-builder/page-builder.service';

@Module({
    imports: [TypeOrmModule.forFeature([PageBuilder])],
    controllers: [PageBuilderController],
    exports: [TypeOrmModule, PageBuilderService], // <-- make public

})
export class PageBuilderModule { }