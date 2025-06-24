import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialMedia } from './entities/social-media.entity';
import { Repository } from 'typeorm';
import { createSocialMediaDto } from './dto/create-socila-media.dto';

@Injectable()
export class SocialMediaService {
  constructor(
    @InjectRepository(SocialMedia)
    private readonly socialMediaRepository: Repository<SocialMedia>,
  ) {}
  async create(createSocialMediaDto: createSocialMediaDto) {
    const socialMedia = this.socialMediaRepository.create(createSocialMediaDto);
    return await this.socialMediaRepository.save(socialMedia);
  }

  async findOne(id: string) {
    return await this.socialMediaRepository.findOne({ where: { id } });
  }

  async update(id: string, updateSocialMediaDto: UpdateSocialMediaDto) {
    const editedOne = await this.socialMediaRepository.preload({
      id: id,
      ...updateSocialMediaDto,
    });
    return this.socialMediaRepository.save(editedOne);
  }

  async save(socialMedia: SocialMedia) {
    return await this.socialMediaRepository.save(socialMedia);
  }
}
