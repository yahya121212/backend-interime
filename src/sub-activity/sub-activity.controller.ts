import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubActivityService } from './sub-activity.service';
import { UpdateSubActivityDto } from './dto/update-sub-activity.dto';

@Controller('sub-activities')
export class SubActivityController {
  constructor(private readonly subActivityService: SubActivityService) {}

  @Post()
  create(@Body() createSubActivityDto) {
    return this.subActivityService.create(createSubActivityDto);
  }

  @Get()
  async findAll() {
    return await this.subActivityService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return await this.subActivityService.findOneByName(name);
  }
}
