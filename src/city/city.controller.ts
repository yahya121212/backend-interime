import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  async create(@Body() createCityDto) {
    return await this.cityService.create(createCityDto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.cityService.findAll();
  }

  @Public()
  @Get('search')
  async findAllByNameLike(@Query('name') name: string): Promise<any> {
    if (!name) {
      throw new Error('Name query parameter is required');
    }
    return await this.cityService.findAllByNameLike(name);
  }

  @Public()
  @Get(':name')
  async findOne(@Param('name') name: string) {
    return await this.cityService.findOneByName(name);
  }
}
