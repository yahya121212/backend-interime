import { Controller, Post, Body, Put, Get, Param, Delete } from '@nestjs/common';
import { PageBuilderService } from './page-builder.service';
import { Public } from 'src/common/decorators/public.decorator';


@Public()
@Controller('page-builder')
export class PageBuilderController {
    constructor(private readonly service: PageBuilderService) { }

    @Post()
    create(@Body() body: { title: string; data: any }) {
        return this.service.create(body.title, body.data);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }
    @Put(':id')
    async updatePage(
        @Param('id') id: string,
        @Body() body: { title?: string; data?: any },
    ) {
        console.log('Updating page with ID:', id, 'and body:', body);
        const pageId = parseInt(id, 10);
        await this.service.update(pageId, body);
        return await this.service.findOne(pageId);
    }
    @Get()
    findAll() {
        return this.service.findAll();
    }
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }
}