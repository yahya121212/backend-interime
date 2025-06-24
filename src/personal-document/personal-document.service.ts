import { Injectable } from '@nestjs/common';
import { PersonalDocument } from './entities/personal-document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PersonalDocumentService {
  constructor(
    @InjectRepository(PersonalDocument)
    private readonly personalDocumentRepository: Repository<PersonalDocument>,
  ) {}
  async create(file): Promise<PersonalDocument> {
    const newDocument = this.personalDocumentRepository.create({
      type: 'CV',
      addedDate: new Date(),
      description: '',
      link: `/uploads/cvs/${file.filename}`,
    });
    return this.personalDocumentRepository.save(newDocument);
  }

  async update(
    id: string,
    file: Express.Multer.File,
  ): Promise<PersonalDocument> {
    // Update the document in database using file.path
    await this.personalDocumentRepository.update(id, {
      link: file.path, // Using file.path directly
      addedDate: new Date(),
    });

    // Return the updated document
    return this.personalDocumentRepository.findOneBy({ id });
  }
}
