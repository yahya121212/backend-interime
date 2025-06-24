import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  create(@Body() createRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Public()
  @Get('search')
  async findAllByNameLike(@Query('name') name: string): Promise<any> {
    if (!name) {
      throw new Error('Name query parameter is required');
    }
    return await this.regionService.findAllByNameLike(name);
  }
}
