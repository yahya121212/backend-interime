import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageBuilder } from './entities/page-builder.entity';
import { Public } from 'src/common/decorators/public.decorator';

@Public() // Assurez-vous que ce décorateur est importé depuis le bon chemin
@Controller('page-builder')
export class PageBuilderController {
    constructor(
        @InjectRepository(PageBuilder)
        private readonly pageBuilderRepo: Repository<PageBuilder>,
    ) { }
    @Put(':id')
    async updatePage(
        @Param('id') id: string, // change ici
        @Body() body: { title?: string; data?: any },
    ) {
        const pageId = parseInt(id, 10); // conversion explicite
        await this.pageBuilderRepo.update(pageId, body);
        return await this.pageBuilderRepo.findOneBy({ id: pageId });
    }
    @Post()
    async createPage(@Body() body: { title: string; data: any }) {
        const page = this.pageBuilderRepo.create(body);
        return await this.pageBuilderRepo.save(page);
    }

    @Get(':id')
    async getPage(@Param('id') id: number) {
        return await this.pageBuilderRepo.findOneBy({ id });
    }


}