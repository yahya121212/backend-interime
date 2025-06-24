import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RightService } from './right.service';
import { CreateRightDto } from './dto/create-right.dto';
import { UpdateRightDto } from './dto/update-right.dto';

@Controller('right')
export class RightController {
  constructor(private readonly rightService: RightService) {}

  @Post()
  create(@Body() createRightDto: CreateRightDto) {
    return this.rightService.create(createRightDto);
  }

  @Get()
  findAll() {
    return this.rightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rightService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRightDto: UpdateRightDto) {
    return this.rightService.update(+id, updateRightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rightService.remove(+id);
  }
}
