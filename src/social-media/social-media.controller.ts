import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SocialMediaService } from './social-media.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { createSocialMediaDto } from './dto/create-socila-media.dto';

@Controller('social-media')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Post()
  create(@Body() createSocialMediaDto: createSocialMediaDto) {
    return this.socialMediaService.create(createSocialMediaDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialMediaService.findOne(id);
  }

  @Patch(':id/update')
  update(
    @Param('id') id: string,
    @Body() updateSocialMediaDto: UpdateSocialMediaDto,
  ) {
    return this.socialMediaService.update(id, updateSocialMediaDto);
  }
}
