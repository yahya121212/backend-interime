import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { LocationService } from 'src/location/location.service';
import { Formation } from 'src/formation/entities/formation.entity';
import { Experience } from 'src/experience/entities/experience.entity';
import { JobService } from 'src/job/job.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  docFileFilter,
  generatedFileName,
} from 'src/personal-document/document.utils';
import { FILE_UPLOAD_DIR, IMAGE_UPLOAD_DIR } from 'src/common/constants';
import { PersonalDocumentService } from 'src/personal-document/personal-document.service';
import { LanguageService } from 'src/language/language.service';
import { SkillService } from 'src/skill/skill.service';
import { FormationService } from 'src/formation/formation.service';
import { ExperienceService } from 'src/experience/experience.service';
import { FilterCandidatesDto } from './entities/filter.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { StatusService } from 'src/status/status.service';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/message/email.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('candidates')
export class CandidateController {
  constructor(
    private readonly candidatService: CandidateService,
    private readonly locationService: LocationService,
    private readonly jobService: JobService,
    private readonly personalDocumentService: PersonalDocumentService,
    private readonly languageService: LanguageService,
    private readonly formationService: FormationService,
    private readonly experienceService: ExperienceService,
    private readonly skillService: SkillService,
    private readonly statusService: StatusService,
    private readonly emailService: EmailService,
  ) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('create')
  async createCandidate(@Body() candidateDto: any) {
    const status = await this.statusService.findStatus('Active', 'User');
    const password = 'admin1234';
    const saltOrRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return await this.candidatService.create({
      ...candidateDto,
      role: Role.CANDIDATE,
      status,
      password: hashedPassword,
      emailVerifiedAt: new Date(),
    });
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.candidatService.findAll(page, limit);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('filter')
  async filter(@Body() filters: FilterCandidatesDto) {
    return await this.candidatService.filterCandidates(filters);
  }

  @Public()
  @Get(':id')
  find(@Param('id') id: string) {
    return this.candidatService.find(id);
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        filename: generatedFileName,
        destination: FILE_UPLOAD_DIR,
      }),
      limits: {
        fileSize: 1000 * 1000 * 15,
      },
      fileFilter: docFileFilter,
    }),
  )
  async create(
    @Body('') profileData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const {
      jobTitle,
      personalDetails,
      location,
      activities,
      skills,
      experiences,
      education,
      languages,
    } = JSON.parse(profileData.userInformation);
    // Check if email already exists
    const existingCandidate = await this.candidatService.findCandidateByEmail(
      personalDetails.emailAddress,
    );

    if (!existingCandidate) {
      throw new NotFoundException(
        `Aucun candidat trouvé avec l'email : ${personalDetails.emailAddress}`,
      );
    }

    existingCandidate.lastName = personalDetails.lastName;
    existingCandidate.firstName = personalDetails.firstName;
    existingCandidate.phone = personalDetails.phoneNumber;
    existingCandidate.profileTitle = jobTitle;
    existingCandidate.profileUpdatedAt = new Date();
    existingCandidate.birthDate = personalDetails.birthday
      ? new Date(personalDetails.birthday)
      : null;

    // Sauvegarder ou associer la localisation
    if (location) {
      existingCandidate.location =
        await this.locationService.findOrCreate(location);
    }

    // Ajouter les metier
    if (activities) {
      existingCandidate.jobs = await Promise.all(
        activities.map(async (job) => {
          return await this.jobService.findOrCreateJobByNameAndSubActivity(
            job.job,
            job.sousActivite,
          );
        }),
      );
    }

    // Ajouter les expériences
    if (experiences) {
      existingCandidate.experiences = experiences.map((expData) => {
        const experience = new Experience();
        experience.companyName = expData.companyName;
        experience.postTitle = expData.postTitle;
        experience.description = expData.description;
        experience.startDate = expData.startDate
          ? new Date(expData.startDate.split('/').reverse().join('-'))
          : null;
        experience.endDate = expData.endDate
          ? new Date(expData.endDate.split('/').reverse().join('-'))
          : null;
        return experience;
      });
    }

    // Ajouter les formations
    if (education) {
      existingCandidate.formations = education.map((eduData) => {
        const formation = new Formation();
        formation.title = eduData.degreeName;
        formation.institution = eduData.universityName;
        formation.startDate = eduData.startDate
          ? new Date(eduData.startDate.split('/').reverse().join('-'))
          : null;
        formation.endDate = eduData.endDate
          ? new Date(eduData.endDate.split('/').reverse().join('-'))
          : null;
        return formation;
      });
    }

    // Ensure `personalDocuments` is an array
    if (!existingCandidate.personalDocuments) {
      existingCandidate.personalDocuments = [];
    }

    if (file) {
      // Check if the candidate already has a CV
      const existingCV = existingCandidate.personalDocuments.find(
        (doc) => doc.type === 'CV',
      );

      if (existingCV) {
        // Update the existing CV
        const updatedCV = await this.personalDocumentService.update(
          existingCV.id,
          file,
        );

        // Find the index of the existing CV
        const index = existingCandidate.personalDocuments.findIndex(
          (doc) => doc.id === existingCV.id,
        );

        // Replace the old CV with the updated one
        if (index !== -1) {
          existingCandidate.personalDocuments[index] = updatedCV;
        }
      } else {
        // Create a new CV if none exists
        const cv = await this.personalDocumentService.create(file);
        existingCandidate.personalDocuments.push(cv);
      }

      await this.candidatService.save(existingCandidate);
    }
    try {
      // Sauvegarder le candidat dans la base de données
      const savedCandidate = await this.candidatService.save(existingCandidate);

      // Ajouter les langues
      if (languages) {
        for (const lang of languages) {
          const { name, level } = lang;

          // Find or create the language
          let languageEntity = await this.languageService.findOneByName(name);

          if (!languageEntity) {
            languageEntity = await this.languageService.create({
              name,
              jobOfferLanguages: [],
              candidateLanguages: [],
            });
          }

          // Create candidateLangue entry
          await this.candidatService.createCandidateLanguage({
            candidate: savedCandidate,
            language: languageEntity,
            level,
          });
        }
      }

      // 4. Ajouter les compétences
      if (skills) {
        for (const skill of skills) {
          const { skillName, level } = skill;

          // Find or create the Skill
          let skillEntity = await this.skillService.findOneByName(skillName);

          if (!skillEntity) {
            skillEntity = await this.skillService.create({
              name: skillName,
              candidateSkills: [],
              offers: [],
            });
          }

          // Create candiadateSkill entry
          await this.candidatService.createCandidateSkill({
            candidate: savedCandidate,
            skill: skillEntity,
            level,
          });
        }
      }
      // Return response with status 201
      return {
        status: 'success',
        message: 'Candidate created successfully.',
        data: savedCandidate,
      };
    } catch (error) {
      // Handle any errors that occur during save
      throw new HttpException(
        {
          status: 'error',
          message:
            'An unexpected error occurred while creating the candidate profile.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('exist')
  async candidateExistance(
    @Body() email: string,
  ): Promise<{ exists: boolean }> {
    const candidate = await this.candidatService.findCandidateByEmail(email);
    return { exists: !!candidate };
  }

  @Post('welcome')
  async sendWelcomeMail(@Body('email') email: any) {
    await this.emailService.sendWelcomeEmail(email);
  }

  @Post('candidate')
  async findCandidateByEmail(@Body('email') email: string) {
    const candidate = await this.candidatService.findCandidateByEmail(email);

    if (!candidate) {
      throw new NotFoundException(
        `Aucun candidat trouvé avec l'email : ${email}`,
      );
    }
    return candidate;
  }

  @Patch(':id')
  edit(@Param('id') id: string, @Body('') updateCandidateDto) {
    return this.candidatService.edit(id, {
      ...updateCandidateDto,
      profileUpdatedAt: new Date(),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatService.delete(id);
  }

  @Post(':id/profile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: IMAGE_UPLOAD_DIR,
        filename: generatedFileName,
      }),
      limits: {
        fileSize: 1000 * 1000 * 15, // 15MB max file size
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type.'), false);
        }
      },
    }),
  )
  async update(
    @Body() profileData: any,
    @Param('id') candidateId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const personalDetails = JSON.parse(profileData.personalDetails || '{}');
    const skills = JSON.parse(profileData.skills || '[]');
    const experiences = JSON.parse(profileData.experiences || '[]');
    const education = JSON.parse(profileData.education || '[]');
    const languages = JSON.parse(profileData.languages || '[]');
    const activities = JSON.parse(profileData.activities || '[]');

    // Check if the candidate exists
    const existingCandidate = await this.candidatService.find(candidateId);

    if (!existingCandidate) {
      throw new NotFoundException(
        `Aucun candidat trouvé avec l'ID : ${candidateId}`,
      );
    }
    if (file) {
      existingCandidate.image = `/uploads/images/${file.filename}`;
    }
    // Update candidate details
    existingCandidate.lastName = personalDetails.lastName;
    existingCandidate.firstName = personalDetails.firstName;
    existingCandidate.phone = personalDetails.phone;
    existingCandidate.profileTitle = personalDetails.profileTitle;
    existingCandidate.profileUpdatedAt = new Date();
    existingCandidate.birthDate = personalDetails.birthday
      ? new Date(personalDetails.birthday)
      : null;

    // Update experiences
    if (experiences) {
      existingCandidate.experiences = await Promise.all(
        experiences.map(async (expData) => {
          const experience = await this.experienceService.findOrCreate(
            candidateId,
            expData.companyName,
          );

          experience.companyName = expData.companyName;
          experience.postTitle = expData.postTitle;
          experience.description = expData.description;
          experience.startDate = expData.startDate
            ? new Date(expData.startDate)
            : null;
          experience.endDate = expData.endDate
            ? new Date(expData.endDate)
            : null;

          return experience;
        }),
      );
    }
    // Update education
    if (education) {
      existingCandidate.formations = await Promise.all(
        education.map(async (eduData) => {
          const formation = await this.formationService.findOrCreate(
            candidateId,
            eduData.degreeName,
          );

          formation.title = eduData.degreeName;
          formation.institution = eduData.universityName;
          formation.startDate = eduData.startDate
            ? new Date(eduData.startDate)
            : null;
          formation.endDate = eduData.endDate
            ? new Date(eduData.endDate)
            : null;

          return formation;
        }),
      );
    }

    // Ajouter les metier
    if (activities) {
      existingCandidate.jobs = await Promise.all(
        activities.map(async (job) => {
          return await this.jobService.findOrCreateJobByNameAndSubActivity(
            job.job,
            job.sousActivite,
          );
        }),
      );
    }

    try {
      // Save the candidate with updated details
      const updatedCandidate =
        await this.candidatService.save(existingCandidate);

      // Update languages
      if (languages) {
        // Delete existing language relations for this candidate
        await this.candidatService.deleteCandidateLanguages(candidateId);

        // Add new language relations
        for (const lang of languages) {
          const { name, level } = lang;

          let languageEntity = await this.languageService.findOneByName(name);

          if (!languageEntity) {
            languageEntity = await this.languageService.create({
              name,
              jobOfferLanguages: [],
              candidateLanguages: [],
            });
          }

          const candidateLanguage =
            await this.candidatService.findCandidateLanguage(
              candidateId,
              languageEntity.id,
            );

          if (!candidateLanguage) {
            await this.candidatService.createCandidateLanguage({
              candidate: updatedCandidate,
              language: languageEntity,
              level,
            });
          } else {
            candidateLanguage.level = level;
            await this.candidatService.saveCandidateLanguage(candidateLanguage);
          }
        }
      }

      // Update skills
      if (skills) {
        // Delete existing skill relations for this candidate
        await this.candidatService.deleteCandidateSkills(candidateId);

        for (const skill of skills) {
          const { skillName, level } = skill;

          let skillEntity = await this.skillService.findOneByName(skillName);

          if (!skillEntity) {
            skillEntity = await this.skillService.create({
              name: skillName,
              candidateSkills: [],
              offers: [],
            });
          }

          const candidateSkill = await this.candidatService.findCandidateSkill(
            candidateId,
            skillEntity.id,
          );

          if (!candidateSkill) {
            await this.candidatService.createCandidateSkill({
              candidate: updatedCandidate,
              skill: skillEntity,
              level,
            });
          } else {
            candidateSkill.level = level;
            await this.candidatService.saveCandidateSkill(candidateSkill);
          }
        }
      }

      // Return response with status 200
      return {
        status: 'success',
        message: 'Candidate updated successfully.',
        data: updatedCandidate,
      };
    } catch (error) {
      // Handle any errors that occur during the update
      throw new HttpException(
        {
          status: 'error',
          message:
            'An unexpected error occurred while updating the candidate profile.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
