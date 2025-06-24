import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobOffer } from './entities/job-offer.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { Status } from 'src/status/entities/status.entity';
import { FindDto } from 'src/api/utils/findDto';
import { FilterOffersDto } from './dto/filter-offers.dto';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { CandidateJobOffer } from 'src/job-offer/entities/CandidateJobOffer.entity';
import { StatusService } from 'src/status/status.service';
import { PersonService } from 'src/person/person.service';
import { EmailService } from 'src/message/email.service';
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class JobOfferService {
  constructor(
    @InjectRepository(JobOffer)
    private readonly offerRepository: Repository<JobOffer>,
    @InjectRepository(CandidateJobOffer)
    private readonly candidateJobOfferRepository: Repository<CandidateJobOffer>,
    private readonly statusService: StatusService,
    private readonly userService: PersonService,
    private readonly emailService: EmailService,
  ) {}

  async create(createJobOfferDto: CreateJobOfferDto): Promise<JobOffer> {
    const offer = this.offerRepository.create(createJobOfferDto);
    return await this.offerRepository.save(offer);
  }

  async findAll({ page = 1, limit = 10, companyId, status = null }: FindDto) {
    const companyIdT = companyId?.trim();
    const where: any = { company: { id: companyIdT } };

    if (status) {
      where.status = { name: status };
    }
    if (page < 1) page = 1;
    const [data, total] = await this.offerRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['contractType', 'job', 'city', 'status', 'company'],
    });

    return { data, total };
  }

  async findAllOffers() {
    return await this.offerRepository.find({
      relations: ['company', 'contractType', 'job', 'city', 'status'],
    });
  }

  async findpublishedOffers(page: number, limit: number) {
    const [offers, total] = await this.offerRepository.findAndCount({
      where: { isAvailable: true },
      relations: [
        'company',
        'contractType',
        'job',
        'job.subActivity',
        'job.subActivity.activity',
        'city',
        'city.department',
        'city.department.region',
        'status',
        'salaryType',
        'skills',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        publicationDate: 'DESC',
      },
    });
    return { offers, total };
  }

  async findOne(id: string) {
    return await this.offerRepository.findOne({
      where: { id },
      relations: [
        'status',
        'company',
        'company.employees',
        'company.socialMedia',
        'job.subActivity.activity',
        'contractType',
        'city.department.region',
        'skills',
        'contracts',
        'evaluation',
        'salaryType',
        'jobOfferLanguages.language',
        'candidateJobOffers',
        'candidateJobOffers.candidate',
        'candidateJobOffers.status',
      ],
    });
  }

  async publish(id: string, status: Status) {
    const editedOffer = await this.offerRepository.preload({
      id: id,
      status,
      isAvailable: true,
      publicationDate: new Date(),
    });
    if (!editedOffer) {
      throw new NotFoundException('Offer not found');
    }
    return await this.offerRepository.save(editedOffer);
  }

  async disable(id: string, status: Status) {
    const editedOffer = await this.offerRepository.preload({
      id: id,
      status,
    });
    if (!editedOffer) {
      throw new NotFoundException('Offer not found');
    }
    return await this.offerRepository.save(editedOffer);
  }

  async filterOffers(filters: FilterOffersDto): Promise<JobOffer[]> {
    const query = this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.company', 'company')
      .leftJoinAndSelect('offer.status', 'status')
      .leftJoinAndSelect('offer.contractType', 'contractType')
      .leftJoinAndSelect('offer.city', 'city')
      .leftJoinAndSelect('city.department', 'department')
      .leftJoinAndSelect('department.region', 'region');

    if (filters.title) {
      query.andWhere('offer.title ILIKE :title', {
        title: `%${filters.title}%`,
      });
    }

    if (filters.companyName) {
      query.andWhere('company.name ILIKE :companyName', {
        companyName: `%${filters.companyName}%`,
      });
    }

    if (filters.contractType) {
      query.andWhere('contractType.description ILIKE :contractType', {
        contractType: `%${filters.contractType}%`,
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

  async remove(id: string) {
    await this.offerRepository.delete(id);
  }

  async update(id: string, updateData: Partial<JobOffer>): Promise<JobOffer> {
    // Find the existing job offer
    const jobOffer = await this.offerRepository.findOne({
      where: { id },
      relations: ['skills', 'jobOfferLanguages'], // Include relations if needed
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${id} not found`);
    }

    // Update the job offer entity with the new data
    const updatedJobOffer = this.offerRepository.merge(jobOffer, updateData);

    // Save the updated job offer to the database
    return await this.offerRepository.save(updatedJobOffer);
  }

  async removeSkillsFromJobOffer(jobOffer: JobOffer): Promise<void> {
    // Remove all skills associated with the job offer
    jobOffer.skills = [];
    await this.offerRepository.save(jobOffer);
  }

  async removeLanguagesFromJobOffer(jobOffer: JobOffer): Promise<void> {
    // Remove all languages associated with the job offer
    jobOffer.jobOfferLanguages = [];
    await this.offerRepository.save(jobOffer);
  }

  async countOffersByActivity() {
    const result = await this.offerRepository
      .createQueryBuilder('offer')
      .select('activity.name', 'activityName') // Accessing activity name directly
      .addSelect('COUNT(offer.id)', 'offerCount')
      .innerJoin('offer.job', 'job') // Join job
      .innerJoin('job.subActivity', 'subActivity') // Join subActivity
      .innerJoin('subActivity.activity', 'activity') // Join activity
      .where('offer.isAvailable = :isAvailable', { isAvailable: true })
      .groupBy('activity.name') // Group by activity name
      .getRawMany();

    return result;
  }

  async countOffersBySubActivity() {
    const result = await this.offerRepository
      .createQueryBuilder('offer')
      .select('subActivity.name', 'subActivityName') // Ensure correct path
      .addSelect('COUNT(offer.id)', 'offerCount')
      .innerJoin('offer.job', 'job')
      .innerJoin('job.subActivity', 'subActivity') // Ensure this join exists
      .where('offer.isAvailable = :isAvailable', { isAvailable: true })
      .groupBy('subActivity.name') // Group by the correct field
      .getRawMany();

    return result;
  }

  async countOffersByContractType() {
    const result = await this.offerRepository
      .createQueryBuilder('offer')
      .select('contractType.description', 'contractTypeDescription')
      .addSelect('COUNT(offer.id)', 'offerCount')
      .innerJoin('offer.contractType', 'contractType')
      .where('offer.isAvailable = :isAvailable', { isAvailable: true })
      .groupBy('contractType.description')
      .getRawMany();

    return result;
  }

  async filterOffersWithArraysOfCheckedValues(
    selectedActivities: string[],
    selectedSubActivities: string[],
    selectedContractTypes: string[],
  ): Promise<JobOffer[]> {
    const query = this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.company', 'company')
      .leftJoinAndSelect('offer.contractType', 'contractType')
      .leftJoinAndSelect('offer.job', 'job')
      .leftJoinAndSelect('job.subActivity', 'subActivity')
      .leftJoinAndSelect('subActivity.activity', 'activity')
      .leftJoinAndSelect('offer.city', 'city')
      .leftJoinAndSelect('city.department', 'department')
      .leftJoinAndSelect('department.region', 'region')
      .leftJoinAndSelect('offer.status', 'status')
      .leftJoinAndSelect('offer.salaryType', 'salaryType')
      .leftJoinAndSelect('offer.skills', 'skills')
      .where('offer.isAvailable = :isAvailable', { isAvailable: true });

    // Merging filters for activities
    if (selectedActivities.length > 0) {
      query.andWhere('activity.name IN (:...selectedActivities)', {
        selectedActivities,
      });
    }

    // Merging filters for sub-activities
    if (selectedSubActivities.length > 0) {
      query.andWhere('subActivity.name IN (:...selectedSubActivities)', {
        selectedSubActivities,
      });
    }

    // Merging filters for contract types
    if (selectedContractTypes.length > 0) {
      query.andWhere(
        'contractType.description IN (:...selectedContractTypes)',
        { selectedContractTypes },
      );
    }

    return query.getMany();
  }

  async findPublishedOffersByCompany(
    companyId: string,
    page: number,
    limit: number,
  ) {
    const [offers, total] = await this.offerRepository.findAndCount({
      where: { isAvailable: true, company: { id: companyId } },
      relations: [
        'contractType',
        'job',
        'job.subActivity',
        'city',
        'candidateJobOffers',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        publicationDate: 'DESC',
      },
    });

    return { offers, total };
  }

  async updateOfferStatus(id: string, statusName: string): Promise<JobOffer> {
    // Find the status by name
    const status = await this.statusService.findStatus(statusName, 'JobOffer');
    if (!status) {
      throw new NotFoundException(`Status '${statusName}' not found`);
    }

    // Update the offer's status directly
    const updateResult = await this.offerRepository.update(id, {
      status,
      isAvailable: statusName === 'Closed' ? false : true,
    });

    if (updateResult.affected === 0) {
      throw new NotFoundException(
        `Job offer with ID ${id} not found or no changes made`,
      );
    }

    const updatedOffer = await this.offerRepository.findOne({
      where: { id }, // Use the 'where' option to specify the ID
    });

    return updatedOffer; // Return the updated offer
  }

  async countCompanyOffers(companyId: string): Promise<number> {
    return this.offerRepository.count({
      where: { company: { id: companyId } },
    });
  }

  async countOffersByStatus(
    companyId: string,
    status: string,
  ): Promise<number> {
    return this.offerRepository.count({
      where: {
        company: { id: companyId },
        status: { name: status },
      },
    });
  }

  async countAvailableOffers(companyId: string): Promise<number> {
    return this.offerRepository.count({
      where: {
        isAvailable: true,
        company: { id: companyId },
      },
    });
  }

  //  Here  CandidateJobOffer  candidateJobOfferRepository

  async hasApplied(jobOffer: JobOffer, candidate: Candidate): Promise<boolean> {
    const candidateJobOffers = await this.candidateJobOfferRepository.find({
      where: { jobOffer: { id: jobOffer.id }, candidate: { id: candidate.id } },
    });
    return candidateJobOffers.length > 0;
  }

  async createApplication(
    jobOfferId: string,
    candidateId: string,
    status: Status,
    message: string,
  ) {
    let application = await this.candidateJobOfferRepository.findOne({
      where: { jobOffer: { id: jobOfferId }, candidate: { id: candidateId } },
    });

    if (application) {
      application.status = status;
      application.employeeMessage = message;
      await this.candidateJobOfferRepository.save(application);
    } else {
      throw new Error('Application not found');
    }
  }
  async changeApplicationStatus(
    jobOfferId: string,
    candidateId: string,
    status: Status,
  ) {
    let application = await this.candidateJobOfferRepository.findOne({
      where: { jobOffer: { id: jobOfferId }, candidate: { id: candidateId } },
    });

    if (application) {
      application.status = status;
      await this.candidateJobOfferRepository.save(application);
    } else {
      throw new Error('Application not found');
    }
  }

  async findAllCandidatures(
    page: number,
    limit: number,
    status: string | null,
  ) {
    let condition = {};
    if (status) {
      condition = { name: status };
    } else {
      condition = { context: 'Candidate' };
    }
    const [data, total] = await this.candidateJobOfferRepository.findAndCount({
      where: { status: condition },
      relations: [
        'status',
        'jobOffer',
        'jobOffer.company',
        'jobOffer.company.employees',
        'jobOffer.contractType',
        'candidate',
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    const appliedCount = await this.candidateJobOfferRepository.count({
      where: { status: { name: 'Applied' } },
    });

    const all = await this.candidateJobOfferRepository.count();

    // Count candidatures with status 'Recruitment Approved'
    const recruitmentApprovedCount =
      await this.candidateJobOfferRepository.count({
        where: { status: { name: 'Recruitment Approved' } },
      });

    return { data, total, appliedCount, recruitmentApprovedCount, all };
  }

  async assignCandidateToJobOffer(
    jobOffer: JobOffer,
    candidate: Candidate,
    message: string,
    status: Status,
    admin?: Person,
  ): Promise<void> {
    // Validate required data first
    if (!jobOffer?.company) {
      throw new Error('Job offer company information is missing');
    }

    const candidateJobOffer = new CandidateJobOffer();
    candidateJobOffer.jobOffer = jobOffer;
    candidateJobOffer.candidate = candidate;
    candidateJobOffer.appliedAt = new Date();
    candidateJobOffer.message = message;
    candidateJobOffer.status = status;

    // Send Candidature Confirmation
    const candidateName = `${candidate?.firstName} ${candidate?.lastName}`;
    await this.emailService.sendCandidatureConfirmation(
      candidateName,
      candidate.email,
      jobOffer.title,
      jobOffer.id,
    );

    // Prepare recipients for notification
    const recipients = [];

    // Add employer if available
    const primaryEmployee = jobOffer.company.employees?.[0];
    if (primaryEmployee) {
      const employerName = `${primaryEmployee.firstName} ${primaryEmployee.lastName}`;
      recipients.push({
        name: employerName,
        address: primaryEmployee.email,
      });
    }

    // Add admin if provided
    if (admin) {
      const adminName = `${admin.firstName} ${admin.lastName}`;
      recipients.push({
        name: adminName,
        address: admin.email,
      });
    }

    // Only send notification if there are recipients
    if (recipients.length > 0) {
      await this.emailService.sendCandidatureNotification(
        recipients,
        jobOffer.title,
        jobOffer.id,
        candidate.id,
      );
    }

    await this.candidateJobOfferRepository.save(candidateJobOffer);
  }

  async removeCandidature(id: string) {
    await this.candidateJobOfferRepository.delete(id);
  }
  async changeCandidatureStatus(id: string, status: string) {
    let candidature = await this.candidateJobOfferRepository.findOne({
      where: { id },
    });

    let statusIns = await this.statusService.findStatus(status, 'Candidate');

    candidature.status = statusIns;
    await this.candidateJobOfferRepository.save(candidature);
  }

  async findClosededOffersByCompany(
    companyId: string,
    page: number,
    limit: number,
  ) {
    const [offers, total] = await this.candidateJobOfferRepository.findAndCount(
      {
        where: {
          jobOffer: { company: { id: companyId } },
          status: { name: Not('Applied') },
        },
        relations: [
          'status',
          'jobOffer',
          'jobOffer.city',
          'jobOffer.job',
          'jobOffer.job.subActivity',
          'jobOffer.company',
          'jobOffer.company.employees',
          'jobOffer.contractType',
          'candidate',
        ],
        skip: (page - 1) * limit,
        take: limit,
        order: {
          jobOffer: { publicationDate: 'DESC' },
        },
      },
    );

    return { offers, total };
  }

  async findCandidateCandidatures(
    page: number,
    limit: number,
    id: string,
    status: string | null,
  ) {
    // Build the where condition
    const where: any = {
      candidate: { id }, // Always filter by candidate ID
    };

    // Add status filter if provided
    if (status) {
      where.status = { name: status };
    } else {
      where.status = { name: Not(In(['Accepted', 'Rejected'])) };
    }
    const [data, total] = await this.candidateJobOfferRepository.findAndCount({
      where,
      relations: [
        'status',
        'jobOffer',
        'jobOffer.job',
        'jobOffer.city',
        'jobOffer.company',
        'jobOffer.contractType',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        appliedAt: 'DESC',
      },
    });
    return { data, total };
  }

  async candidateCounts(candidateId: string, status: string | null) {
    const where: any = {
      candidate: { id: candidateId },
    };
    if (status) {
      where.status = { name: status };
    } else {
      where.status = { name: Not(In(['Accepted', 'Rejected'])) };
    }
    return await this.candidateJobOfferRepository.count({
      where,
    });
  }

  async countAllOffers() {
    return await this.offerRepository.count();
  }
  async countAllCandidatures() {
    return await this.candidateJobOfferRepository.count();
  }
}
