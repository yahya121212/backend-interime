import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobOfferLanguageService } from './job-offer-language.service';

@Controller('job-offer-language')
export class JobOfferLanguageController {
  constructor(
    private readonly jobOfferLanguageService: JobOfferLanguageService,
  ) {}

  @Post()
  create(@Body() createJobOfferLanguageDto) {
    return this.jobOfferLanguageService.create(createJobOfferLanguageDto);
  }

  @Get()
  findAll() {
    return this.jobOfferLanguageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobOfferLanguageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobOfferLanguageDto) {
    return this.jobOfferLanguageService.update(+id, updateJobOfferLanguageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobOfferLanguageService.remove(+id);
  }
}
