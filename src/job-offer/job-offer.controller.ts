import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Delete,
  NotFoundException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CompanyEmployee } from 'src/company-employee/entities/company-employee.entity';
import { CompanyService } from 'src/company/company.service';
import { StatusService } from 'src/status/status.service';
import { ContractTypeService } from 'src/contract-type/contract-type.service';
import { JobService } from 'src/job/job.service';
import { CityService } from 'src/city/city.service';
import { SkillService } from 'src/skill/skill.service';
import { LanguageService } from 'src/language/language.service';
import { JobOfferLanguageService } from 'src/job-offer-language/job-offer-language.service';
import { SalaryTypeService } from 'src/salary-type/salary-type.service';
import { FilterOffersDto } from './dto/filter-offers.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CandidateService } from 'src/candidate/candidate.service';
import { Response } from 'express';

@Controller('project')
export class JobOfferController {
  constructor(
    private readonly jobOfferService: JobOfferService,
    private readonly companyService: CompanyService,
    private readonly statusService: StatusService,
    private readonly contractTypeService: ContractTypeService,
    private readonly jobService: JobService,
    private readonly cityService: CityService,
    private readonly skillService: SkillService,
    private readonly languageService: LanguageService,
    private readonly jobOfferLanguageService: JobOfferLanguageService,
    private readonly salaryTypeService: SalaryTypeService,
    private readonly candidateService: CandidateService,
  ) {}

  @Roles('company-employee', 'admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('create')
  async create(
    @Body() createJobOfferDto,
    @CurrentUser() user: CompanyEmployee,
  ) {
    const {
      title,
      description,
      seniority,
      duration,
      timeUnit,
      contractType,
      startDate,
      endDate,
      job,
      city,
      skills,
      subActivity,
      languages,
      salary,
      typologie,
      company,
      publish,
    } = createJobOfferDto;
    var companyEns = null;
    if (company) {
      companyEns = await this.companyService.findOneByName(company);
    } else {
      companyEns = await this.companyService.findByEmployee(user);
    }
    var status = await this.statusService.findStatus('Draft', 'JobOffer');
    var isAvailable = false;
    if (publish) {
      status = await this.statusService.findStatus('Published', 'JobOffer');
      isAvailable = true;
    }
    const contractTypeIns =
      await this.contractTypeService.findOne(contractType);

    const jobIns = await this.jobService.findOrCreateJobByNameAndSubActivity(
      job,
      subActivity,
    );
    const cityIns = await this.cityService.findOneByName(city);

    // Find or create the salary type
    let salaryType = await this.salaryTypeService.findOne(salary, typologie);

    if (!salaryType) {
      salaryType = await this.salaryTypeService.create({
        salary,
        type: typologie,
      });
    }

    //Skills
    const skillsInstances = [];
    for (const skill of skills) {
      const { name } = skill;
      let skillIns = await this.skillService.findOneByName(skill.name); // Find the skill by name
      if (!skillIns) {
        skillIns = await this.skillService.create({ name }); // Create the skill if not found
      }
      skillsInstances.push(skillIns); // Add the skill instance to the array
    }
    const jobOffer = await this.jobOfferService.create({
      title,
      description,
      seniority,
      startDate,
      endDate,
      timeUnit,
      status,
      isAvailable,
      company: companyEns,
      skills: skillsInstances,
      job: jobIns,
      city: cityIns,
      contractType: contractTypeIns,
      expectedDuration: duration,
      salaryType,
    });

    // Handle languages and their levels
    for (const lang of languages) {
      const { name, level } = lang;

      // Find or create the language
      let languageEntity = await this.languageService.findOneByName(name);

      if (!languageEntity) {
        languageEntity = await this.languageService.create({
          name,
          jobOfferLanguages: [], // Initialize with an empty array
          candidateLanguages: [],
        });
      }

      // Create JobOfferLanguage entry
      await this.jobOfferLanguageService.create({
        jobOffer,
        language: languageEntity,
        level,
      });
    }

    return jobOffer;
  }

  @Public()
  @Post('filter')
  async filter(@Body() filters: FilterOffersDto) {
    return await this.jobOfferService.filterOffers(filters);
  }

  @Public()
  @Post('filters')
  async filters(@Body() filters) {
    const { selectedActivities, selectedSubActivities, selectedContractTypes } =
      filters;
    return await this.jobOfferService.filterOffersWithArraysOfCheckedValues(
      selectedActivities,
      selectedSubActivities,
      selectedContractTypes,
    );
  }

  @Roles('company-employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async findAll(@Query() pagination) {
    const { page = 1, limit = 10, company = '', status = null } = pagination;
    const { data, total } = await this.jobOfferService.findAll({
      page,
      limit,
      companyId: company,
      status,
    });

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('candidatures')
  async findAllCandidatures(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string | null = null,
  ) {
    return await this.jobOfferService.findAllCandidatures(page, limit, status);
  }

  @Roles('candidate')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('candidatures/:id')
  async findCandidateCandidatures(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string | null = null,
  ) {
    return await this.jobOfferService.findCandidateCandidatures(
      page,
      limit,
      id,
      status,
    );
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('all')
  findAllOffersWithCompanies() {
    return this.jobOfferService.findAllOffers();
  }

  @Public()
  @Get('published')
  async findpublishedOffers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { offers, total } = await this.jobOfferService.findpublishedOffers(
      page,
      limit,
    );
    return {
      offers,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Roles('company-employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('employer/counts/:companyId')
  async getCounts(@Param('companyId') companyId: string) {
    // All offers count
    const totalOffers =
      await this.jobOfferService.countCompanyOffers(companyId);

    // Active offers (Published status)
    const activeOffers = await this.jobOfferService.countOffersByStatus(
      companyId,
      'Published',
    );

    // Candidatures (Closed status)
    const closedOffers = await this.jobOfferService.countOffersByStatus(
      companyId,
      'Closed',
    );

    // Terminées (Available offers)
    const candidatures =
      await this.jobOfferService.countAvailableOffers(companyId);

    return {
      totalOffers,
      activeOffers,
      closedOffers,
      candidatures,
    };
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/counts')
  async getAdminCounts(@Param('companyId') companyId: string) {
    const totalCandidates = await this.candidateService.countAllCandidates();

    const totalprojects = await this.jobOfferService.countAllOffers();

    const totalClients = await this.companyService.countAllCompanies();

    const totalCandidatures = await this.jobOfferService.countAllCandidatures();

    return {
      totalCandidatures,
      totalprojects,
      totalClients,
      totalCandidates,
    };
  }

  @Roles('candidate')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('candidate/counts/:candidateId')
  async getCandidateCounts(@Param('candidateId') candidateId: string) {
    // candidatures En cours count
    const Candidatures = await this.jobOfferService.candidateCounts(
      candidateId,
      null,
    );

    // Active offers (Accepted status)
    const acceptedCandidature = await this.jobOfferService.candidateCounts(
      candidateId,
      'Accepted',
    );

    // Candidatures (Rejected status)
    const rejectedCandidature = await this.jobOfferService.candidateCounts(
      candidateId,
      'Rejected',
    );

    return {
      Candidatures,
      acceptedCandidature,
      rejectedCandidature,
    };
  }

  @Public()
  @Get('activities')
  countOffersByActivity() {
    return this.jobOfferService.countOffersByActivity();
  }

  @Public()
  @Get('sub-activities')
  countOffersBySubActivity() {
    return this.jobOfferService.countOffersBySubActivity();
  }

  @Public()
  @Get('contract-types')
  countOffersByContractType() {
    return this.jobOfferService.countOffersByContractType();
  }

  @Post('assign/:jobOfferId/candidate/:candidateId')
  async assignCandidateToJobOffer(
    @Param('jobOfferId') jobOfferId: string,
    @Param('candidateId') candidateId: string,
    @Res() response: Response,
    @Body('message') message: string,
  ): Promise<Response> {
    const jobOffer = await this.jobOfferService.findOne(jobOfferId);
    const candidate = await this.candidateService.find(candidateId);
    const admins = await this.companyService.getAllAdmins();
    const admin = admins[0];

    if (!jobOffer || !candidate) {
      return response.status(HttpStatus.NOT_FOUND).json({
        status: 'error',
        message: 'Job offer or candidate not found',
      });
    }

    // Check if the candidate has applied for the job offer
    const hasApplied = await this.jobOfferService.hasApplied(
      jobOffer,
      candidate,
    );

    if (hasApplied) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Candidate has already applied for this job offer',
      });
    }

    const status = await this.statusService.findStatus('Applied', 'Candidate');

    // Assign the candidate to the job offer
    await this.jobOfferService.assignCandidateToJobOffer(
      jobOffer,
      candidate,
      message,
      status,
      admin,
    );

    return response.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Candidate successfully assigned to job offer',
    });
  }

  @Get('available/:companyId')
  async getAvailableOffersByCompany(
    @Param('companyId') companyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { offers, total } =
      await this.jobOfferService.findPublishedOffersByCompany(
        companyId,
        page,
        limit,
      );
    return {
      offers,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get('closed/:companyId')
  async getClosedOffersByCompany(
    @Param('companyId') companyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { offers, total } =
      await this.jobOfferService.findClosededOffersByCompany(
        companyId,
        page,
        limit,
      );
    return {
      offers,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('candidateId') candidateId?: string,
  ) {
    const jobOffer = await this.jobOfferService.findOne(id);

    if (candidateId) {
      const candidate = await this.candidateService.find(candidateId);
      if (candidate) {
        const hasApplied = await this.jobOfferService.hasApplied(
          jobOffer,
          candidate,
        );
        return { ...jobOffer, hasApplied };
      }
    } else {
      return { ...jobOffer, hasApplied: false };
    }

    return jobOffer;
  }

  @Roles('company-employee', 'admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.jobOfferService.remove(id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('candidature/:id')
  async removeCandidature(@Param('id') id: string) {
    return await this.jobOfferService.removeCandidature(id);
  }

  @Roles('company-employee', 'admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    const status = await this.statusService.findStatus('Published', 'JobOffer');
    return this.jobOfferService.publish(id, status);
  }

  @Roles('company-employee', 'admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post(':id/disable')
  async disactivate(@Param('id') id: string) {
    const status = await this.statusService.findStatus('Closed', 'JobOffer');
    return this.jobOfferService.disable(id, status);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('candidature/:id')
  async changeCandidatureStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.jobOfferService.changeCandidatureStatus(id, status);
  }

  @Roles('company-employee', 'admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobOfferDto,
    @CurrentUser() user: CompanyEmployee,
  ) {
    const {
      title,
      description,
      duration,
      timeUnit,
      seniority,
      contractType,
      startDate,
      endDate,
      job,
      city,
      skills,
      subActivity,
      languages,
      salary,
      typologie,
      company,
      status,
    } = updateJobOfferDto;

    // Find the existing job offer
    const jobOffer = await this.jobOfferService.findOne(id);
    if (!jobOffer) {
      throw new NotFoundException('Job offer not found');
    }

    // Update company if provided
    let companyEns = null;
    if (company) {
      companyEns = await this.companyService.findOneByName(company);
    } else {
      companyEns = await this.companyService.findByEmployee(user);
    }

    let isAvailable = false;

    if (status) {
      status === 'Published' ? (isAvailable = true) : (isAvailable = false);
      var statusEns = await this.statusService.findStatus(status, 'JobOffer');
    }

    // Update contract type
    const contractTypeIns =
      await this.contractTypeService.findOne(contractType);

    // Update job and sub-activity
    const jobIns = await this.jobService.findOrCreateJobByNameAndSubActivity(
      job,
      subActivity,
    );

    // Update city
    const cityIns = await this.cityService.findOneByName(city);

    // Update salary type
    let salaryType = await this.salaryTypeService.findOne(salary, typologie);
    if (!salaryType) {
      salaryType = await this.salaryTypeService.create({
        salary,
        type: typologie,
      });
    }

    // Remove existing skills and recreate them
    await this.jobOfferService.removeSkillsFromJobOffer(jobOffer);
    const skillsInstances = [];
    for (const skill of skills) {
      const { name } = skill;
      let skillIns = await this.skillService.findOneByName(name);
      if (!skillIns) {
        skillIns = await this.skillService.create({ name });
      }
      skillsInstances.push(skillIns);
    }

    // Remove existing languages and recreate them
    await this.jobOfferService.removeLanguagesFromJobOffer(jobOffer);
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

      // Create JobOfferLanguage entry
      await this.jobOfferLanguageService.create({
        jobOffer,
        language: languageEntity,
        level,
      });
    }

    // Update the job offer with new data
    const updatedJobOffer = await this.jobOfferService.update(jobOffer.id, {
      title,
      description,
      isAvailable,
      seniority,
      startDate,
      endDate,
      timeUnit,
      status: statusEns,
      company: companyEns,
      skills: skillsInstances,
      job: jobIns,
      city: cityIns,
      contractType: contractTypeIns,
      expectedDuration: duration,
      salaryType,
    });

    return updatedJobOffer;
  }
}
