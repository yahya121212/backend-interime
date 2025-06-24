import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { StatusService } from 'src/status/status.service';
import * as bcrypt from 'bcrypt';
import { CandidateLanguage } from 'src/skill/entities/candidate-luanguage.entity';
import { Language } from 'src/language/entities/language.entity';
import { CandidateSkill } from 'src/skill/entities/candidate-skill.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { FilterCandidatesDto } from './entities/filter.dto';
import { Status } from 'src/status/entities/status.entity';
import { EmailService } from 'src/message/email.service';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(CandidateLanguage)
    private readonly candidateLanguageRepo: Repository<CandidateLanguage>,
    @InjectRepository(CandidateSkill)
    private readonly candidateskillRepo: Repository<CandidateSkill>,
    private readonly statusService: StatusService,
    private emailService: EmailService,
  ) { }
  async findByEmail(email: string): Promise<Candidate | null> {
    return await this.candidateRepository.findOne({
      where: { email },
    });
  }
  async signUpGlg(dto) {
    const inactiveStatus = await this.statusService.findStatus(
      'Inactive',
      'User',
    );

    let hashedPassword: string | undefined = undefined;

    if (dto.password) {
      const saltOrRounds = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);
    }

    const existingUser = await this.candidateRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const user = this.candidateRepository.create({
      ...dto,
      password: hashedPassword, // sera undefined si Google login
      status: inactiveStatus,
    });
    const newUser = await this.candidateRepository.save(user);
    return newUser[0];
  }

  async signUp(dto) {
    const inactiveStatus = await this.statusService.findStatus(
      'Inactive',
      'User',
    );
    const saltOrRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);

    const existingUser = await this.candidateRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.candidateRepository.create({
      ...dto,
      password: hashedPassword,
      status: inactiveStatus,
    });

    const newUser = await this.candidateRepository.save(user);

    return newUser;
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.candidateRepository.findAndCount({
      relations: ['status', 'personalDocuments'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return { data, total };
  }

  async find(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({
      where: { id },
      relations: [
        'location',
        'location.postalCode',
        'location.city',
        'location.city.department',
        'location.city.department.region',
        'formations',
        'experiences',
        'candidateSkills.skill',
        'candidateLanguages.language',
        'personalDocuments',
        'jobs',
        'jobs.subActivity',
        'jobs.subActivity.activity',
      ],
    });

    if (!candidate) {
      throw new NotFoundException('this Candidate not found');
    }
    return candidate;
  }

  async findCandidateByEmail(email: string) {
    if (!email) {
      throw new BadRequestException("L'email est requis.");
    }
    const candidate = await this.candidateRepository.findOne({
      where: { email },
      relations: [
        'formations',
        'experiences',
        'candidateSkills.skill',
        'candidateLanguages.language',
        'personalDocuments',
        'jobs',
        'jobs.subActivity',
        'jobs.subActivity.activity',
      ],
    });

    return candidate;
  }

  async create(createCandidateDto) {
    const candidate = this.candidateRepository.create(createCandidateDto);
    return this.candidateRepository.save(candidate);
  }

  async edit(id: string, updateCandidateDto) {
    const editedCandidate = await this.candidateRepository.preload({
      id: id,
      ...updateCandidateDto,
    });

    if (!editedCandidate) {
      throw new NotFoundException('this Candidate not found');
    }

    return this.candidateRepository.save(editedCandidate);
  }

  async createCandidateLanguage(data: {
    candidate?: Candidate;
    language?: Language;
    level?: string;
  }) {
    const candidateLanguage = this.candidateLanguageRepo.create(data);
    return await this.candidateLanguageRepo.save(candidateLanguage);
  }

  async createCandidateSkill(data: {
    candidate?: Candidate;
    skill?: Skill;
    level?: string;
  }) {
    const candidateSkill = this.candidateskillRepo.create(data);
    return await this.candidateskillRepo.save(candidateSkill);
  }

  async delete(id: string) {
    await this.candidateRepository.delete(id);
  }

  async save(candidate: Candidate): Promise<Candidate> {
    return await this.candidateRepository.save(candidate);
  }

  async findCandidateSkill(
    candidateId: string,
    skillId: string,
  ): Promise<CandidateSkill | null> {
    return await this.candidateskillRepo.findOne({
      where: {
        candidate: { id: candidateId },
        skill: { id: skillId },
      },
      relations: ['candidate', 'skill'], // Ensure relations are loaded if needed
    });
  }
  async saveCandidateSkill(
    candidateSkill: CandidateSkill,
  ): Promise<CandidateSkill> {
    return await this.candidateskillRepo.save(candidateSkill);
  }

  async findCandidateLanguage(
    candidateId: string,
    languageId: string,
  ): Promise<CandidateLanguage | null> {
    return await this.candidateLanguageRepo.findOne({
      where: {
        candidate: { id: candidateId },
        language: { id: languageId },
      },
      relations: ['candidate', 'language'], // Ensure relations are loaded if needed
    });
  }

  async saveCandidateLanguage(
    candidateLanguage: CandidateLanguage,
  ): Promise<CandidateLanguage> {
    return await this.candidateLanguageRepo.save(candidateLanguage);
  }
  async deleteCandidateLanguages(candidateId: string): Promise<void> {
    await this.candidateLanguageRepo.delete({
      candidate: { id: candidateId },
    });
  }

  async deleteCandidateSkills(candidateId: string): Promise<void> {
    await this.candidateskillRepo.delete({
      candidate: { id: candidateId },
    });
  }

  async filterCandidates(filters: FilterCandidatesDto): Promise<Candidate[]> {
    const query = this.candidateRepository
      .createQueryBuilder('candidate')
      .leftJoinAndSelect('candidate.status', 'status')
      .leftJoinAndSelect('candidate.location', 'location')
      .leftJoinAndSelect('location.city', 'city')
      .leftJoinAndSelect('city.department', 'department')
      .leftJoinAndSelect('department.region', 'region');

    if (filters.profileTiltle) {
      query.andWhere('candidate.profileTitle ILIKE :profileTiltle', {
        profileTiltle: `%${filters.profileTiltle}%`,
      });
    }

    if (filters.firstName) {
      query.andWhere('candidate.firstName ILIKE :firstName', {
        firstName: `%${filters.firstName}%`,
      });
    }

    if (filters.lastName) {
      query.andWhere('candidate.lastName ILIKE :lastName', {
        lastName: `%${filters.lastName}%`,
      });
    }

    if (filters.city) {
      query.andWhere('city.name ILIKE :city', {
        city: `%${filters.city}%`,
      });
    }

    if (filters.department) {
      query.andWhere('department.name ILIKE :department', {
        department: `%${filters.department}%`,
      });
    }

    if (filters.region) {
      query.andWhere('region.name ILIKE :region', {
        region: `%${filters.region}%`,
      });
    }
    if (filters.status) {
      query.andWhere('status.name ILIKE :status', {
        status: `%${filters.status}%`,
      });
    }

    return query.getMany();
  }

  async updateStatus(candidateEns: any, status: Status) {
    const candidate = await this.candidateRepository.findOne({
      where: { id: candidateEns?.id },
      relations: ['status'], // Include the existing socialMedia relation
    });

    if (!candidate) {
      throw new NotFoundException(
        `Company with ID ${candidateEns?.id} not found`,
      );
    }

    candidate.status = status;
    await this.candidateRepository.save(candidate);
  }
  async sendWelcomeMail(email: string) {
    return await this.emailService.sendWelcomeEmail(email);
  }
  async countAllCandidates() {
    return await this.candidateRepository.count();
  }
}
