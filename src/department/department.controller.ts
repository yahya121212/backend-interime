import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() createDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Public()
  @Get('search')
  async findAllByNameLike(@Query('name') name: string): Promise<any> {
    if (!name) {
      throw new Error('Name query parameter is required');
    }
    return await this.departmentService.findAllByNameLike(name);
  }
}
