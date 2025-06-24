import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostalCodeService } from './postal-code.service';

@Controller('zip-codes')
export class PostalCodeController {
  constructor(private readonly postalCodeService: PostalCodeService) {}

  @Post()
  create(@Body() createPostalCodeDto) {
    return this.postalCodeService.create(createPostalCodeDto);
  }

  @Get()
  findAll() {
    return this.postalCodeService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.postalCodeService.findOneByCode(code);
  }
}
