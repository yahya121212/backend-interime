import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Location } from 'src/location/entities/location.entity';
import { EmailService } from 'src/message/email.service';
import { FRONT_LOGIN } from 'src/common/constants';
import { CompanyType } from './entities/company-type.entity';
import { StatusService } from 'src/status/status.service';
import { CityService } from 'src/city/city.service';
import { PostalCodeService } from 'src/postal-code/postal-code.service';
import { CompanyEmployeeService } from 'src/company-employee/company-employee.service';
import { NotificationService } from 'src/notification/notification.service';
import { PersonService } from 'src/person/person.service';
import { NotificationType } from 'src/common/enums/Notification.enum';
import { MessageService } from 'src/message/message.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { CompanyEmployee } from 'src/company-employee/entities/company-employee.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SocialMedia } from 'src/social-media/entities/social-media.entity';
import { SocialMediaService } from 'src/social-media/social-media.service';
import { Status } from 'src/status/entities/status.entity';
import { FilterCompanyDto } from './dto/filter-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyType)
    private readonly companyTypeRepository: Repository<CompanyType>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly companyEmployeeService: CompanyEmployeeService,
    private readonly statusService: StatusService,
    private readonly cityService: CityService,
    private readonly zipCodeService: PostalCodeService,
    private emailService: EmailService,
    private readonly notificationService: NotificationService,
    private readonly usersService: PersonService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly socialMediaService: SocialMediaService,
  ) {}

  async create(createCompanyDto, employee): Promise<Company> {
    const { location, siret, ...companyData } = createCompanyDto;

    const clientCompanyType = await this.companyTypeRepository.findOne({
      where: { desctiption: 'Client' },
    });

    // Check if the company already exists using the SIRET number
    let existingCompany = await this.companyRepository.findOne({
      where: { siret },
      relations: ['employees'],
    });

    // Retrieve the pending status entity
    const pendingStatus = await this.statusService.findStatus(
      'Pending',
      'Company',
    );

    // Find PostalCode and City entities
    const postalCodeEntity = await this.zipCodeService.findOneByCode(
      location.postalCode,
    );
    const cityEntity = await this.cityService.findOneByName(location.city);

    if (!existingCompany) {
      // Create a new company
      const newLocation = this.locationRepository.create({
        ...location,
        postalCode: postalCodeEntity,
        city: cityEntity,
      });
      const locationIns = await this.locationRepository.save(newLocation);

      const newCompany = this.companyRepository.create({
        ...companyData,
        siret,
        location: locationIns,
        status: pendingStatus,
        employees: [employee],
        companyType: clientCompanyType,
      });
      const newCompanySaved = await this.companyRepository.save(newCompany);
      const singleCompanySaved = Array.isArray(newCompanySaved)
        ? newCompanySaved[0]
        : newCompanySaved;
      // Notify admins and create a conversation
      const admins = await this.getAllAdmins();
      await this.notificationService.sendNotifications(
        'Nouvelle entreprise',
        'Une nouvelle entreprise a soumis une demande avec un message',
        NotificationType.MESSAGE,
        'Redirect to Chat',
        admins,
      );

      const messageUnreadStatus = await this.statusService.findStatus(
        'Unread',
        'Notification',
      );
      const sender = employee;
      const recipient = admins[0];

      const message = await this.messageService.create({
        content: createCompanyDto.message,
        status: messageUnreadStatus,
        sender,
        recipient,
      });

      await this.conversationService.create({
        type: 'Discussion liée à une entreprise',
        participents: [sender, recipient],
        messages: [message],
        status: messageUnreadStatus,
      });

      return singleCompanySaved;
    } else {
      // Associate the employee with the existing company
      existingCompany.employees.push(employee);
      await this.companyRepository.save(existingCompany);
      return existingCompany;
    }
  }

  async findInactiveCompanies(page: number, limit: number) {
    const inactiveStatus = await this.statusService.findStatus(
      'Pending',
      'Company',
    );

    const [data, total] = await this.companyRepository.findAndCount({
      where: {
        status: inactiveStatus,
        employees: { id: Not(IsNull()) },
      },
      relations: [
        'location',
        'location.city',
        'location.city.department',
        'location.city.department.region',
        'status',
        'employees',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return { data, total };
  }

  async findAllCompanies(page: number, limit: number) {
    const [data, total] = await this.companyRepository.findAndCount({
      where: {
        status: { name: In(['Active', 'Inactive']) },
      },
      relations: [
        'location',
        'status',
        'employees',
        'location.city.department.region',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return { data, total };
  }

  async getAllCompanies() {
    return await this.companyRepository.find({
      where: {
        status: { name: In(['Active']) },
      },
      relations: ['status'],
    });
  }

  async findCompaniesTypes() {
    return await this.companyTypeRepository.find();
  }

  async findOne(id: string) {
    return await this.companyRepository.findOne({
      where: { id: id },
      relations: [
        'location',
        'location.postalCode',
        'location.city.department.region',
        'employees',
        'socialMedia',
        'status',
      ],
    });
  }
  async findOneByName(name: string) {
    return await this.companyRepository.findOne({
      where: { name },
    });
  }

  async findByEmployee(employee: CompanyEmployee): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { employees: { id: employee.id } },
      relations: ['employees'], // Ensure the relation is loaded
    });
  }

  async findOneBySiret(siret): Promise<Company | null> {
    return await this.companyRepository.findOne({ where: { siret } });
  }

  async findCompanyTypeByDesc(desc: string): Promise<CompanyType | null> {
    return await this.companyTypeRepository.findOne({
      where: { desctiption: desc },
    });
  }

  async remove(id: string) {
    await this.companyRepository.delete(id);
  }

  async save(company: Company) {
    await this.companyRepository.save(company);
  }

  async saveCompanyType(companyType: CompanyType) {
    await this.companyTypeRepository.save(companyType);
  }

  //

  async approveCompany(companyId: string) {
    // Find the company by id
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['employees'],
    });

    // Find the 'Active' status by description and type
    const activeStatus = await this.statusService.findStatus(
      'Active',
      'Company',
    );

    // Check if both the company and status were found
    if (company && activeStatus) {
      company.status = activeStatus;

      const lastEmployee =
        await this.companyEmployeeService.findLastEmployee(company);

      this.companyRepository.save(company);
      if (lastEmployee) {
        await this.sendApprovalEmail(lastEmployee);
      }

      return {
        statusCode: HttpStatus.OK,
        message:
          "La company a été activée et l'email d'approbation a été envoyé à l'employé.",
      };
    } else {
      throw new NotFoundException('Company or Status not found');
    }
  }

  async approveSelectedCompanies(companyIds: string[]) {
    // Find the 'Active' status ID
    const activeStatus = await this.statusService.findStatus(
      'Active',
      'Company',
    );
    if (!activeStatus) {
      throw new NotFoundException('Active status not found');
    }

    // Update all selected companies in a single query
    const updateResult = await this.companyRepository
      .createQueryBuilder()
      .update(Company)
      .set({ status: activeStatus }) // Set status to 'Active'
      .where('id IN (:...companyIds)', { companyIds }) // Update only selected IDs
      .execute();

    // After updating the companies, send approval emails to their last employees
    for (const companyId of companyIds) {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: ['employees'],
      });

      if (company && company.employees?.length) {
        // Assuming the last employee is the one to get the email
        const lastEmployee = company.employees[company.employees.length - 1];
        // Send approval email to the last employee
        await this.sendApprovalEmail(lastEmployee);
      }
    }

    return {
      statusCode: HttpStatus.OK,
      message: `entreprises approuvées.`,
      // message: `${updateResult.affected} entreprises approuvées.`,
    };
  }

  async rejectCompany(companyId: string) {
    // Find the company by id using the where clause
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['employees'],
    });

    // Find the 'Rejected' status by description and type
    const rejectedStatus = await this.statusService.findStatus(
      'Rejected',
      'Company',
    );

    // Ensure both company and status are found
    if (company && rejectedStatus) {
      company.status = rejectedStatus;

      const lastEmployee =
        await this.companyEmployeeService.findLastEmployee(company);

      this.companyRepository.save(company);
      if (lastEmployee) {
        await this.sendRejectionEmail(lastEmployee);
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          message:
            "La demande de la société a été rejetée et l'employé a été informé par email.",
        },
        HttpStatus.OK,
      );
    } else {
      throw new NotFoundException('Company or Status not found');
    }
  }

  async sendApprovalEmail(user) {
    const { firstName, lastName, email } = user;
    const fullName = `${firstName} ${lastName}`;

    await this.emailService.sendEmail({
      subject: 'Interim - Demande Approuvée',
      recipients: [{ name: fullName, address: email }],
      html: `
    <p>Bonjour <strong>${lastName}</strong>,</p>

      <p>Votre compte sur <strong>Intérim-Online</strong> a été validé par notre équipe.</p>

      <p>Vous pouvez maintenant accéder à votre espace en cliquant sur le lien ci-dessous :</p>

      <p style="text-align: center;">
        <a href="${FRONT_LOGIN}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;">Accéder à mon espace</a>
      </p>

      <p>Vous pouvez dès à présent publier une offre.</p>

      <p>Nous restons à votre disposition pour toute assistance.</p>

      <p>À bientôt sur <strong>Intérim-Online</strong> !</p>

      <p>L’équipe support</p>
      `,
    });
  }

  async sendRejectionEmail(user) {
    const { firstName, lastName, email } = user;
    const fullName = `${firstName} ${lastName}`;

    await this.emailService.sendEmail({
      subject: 'Interim - Demande Rejetée',
      recipients: [{ name: fullName, address: email }],
      html: `
        <p>Bonjour <strong>${lastName}</strong>,</p>

        <p>Nous vous informons que votre demande de création de compte sur <strong>Intérim-Online</strong> n’a pas pu être validée.</p>

        <p>Pour toute question ou pour soumettre une nouvelle demande, nous vous invitons à contacter notre équipe au plus vite.</p>

        <p>Merci de votre compréhension,</p>

        <p>L’équipe Intérim-Online</p>
          `,
    });
  }

  async updateStatus(companyId: string, status: Status) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['status'], // Include the existing socialMedia relation
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    company.status = status;
    await this.companyRepository.save(company);
  }

  async updateCompany(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
    coverImageFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ) {
    const {
      firstName,
      lastName,
      phone,
      email,
      userId,
      linkedIn,
      facebook,
      instagram,
      emailHasChanged,
    } = updateCompanyDto;
    const instagramV = instagram === 'undefined' ? null : instagram;
    const facebookV = facebook === 'undefined' ? null : facebook;
    const linkedinV = linkedIn === 'undefined' ? null : linkedIn;
    const socialMediaDto = {
      instagram: instagramV,
      facebook: facebookV,
      linkedIn: linkedinV,
    };
    const employeeDto = { firstName, lastName, phone, email };

    // Check if email is provided and exists in the database
    if (email && emailHasChanged) {
      const user = await this.usersService.findOneByEmail(email);
      if (user) {
        throw new ConflictException(
          "L'email existe déjà dans la base de données.",
        );
      }
      const userName = `${user.firstName} ${user.lastName}`;

      if (emailHasChanged) {
        await this.emailService.sendResetPasswordEmail(userName, email);
      }
    }

    await this.companyEmployeeService.update(userId, employeeDto);
    // Find the company by ID
    const company = await this.findOne(companyId);

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    let socialMedia: SocialMedia;

    if (company.socialMedia) {
      // Update the existing socialMedia entity
      socialMedia = await this.socialMediaService.save({
        ...company.socialMedia,
        ...socialMediaDto, // Merge the DTO with the existing entity
      });
    } else {
      // Create a new SocialMedia entity
      socialMedia = await this.socialMediaService.create(socialMediaDto);

      company.socialMedia = socialMedia;
      await this.companyRepository.save(company);
    }
    // Handle coverImage file
    if (coverImageFile) {
      const coverImagePath = `/uploads/covers/${coverImageFile.filename}`;
      company.coverImage = coverImagePath; // Save the cover image file path
    }

    if (imageFile) {
      const imagePath = `/uploads/images/${imageFile.filename}`;
      company.image = imagePath; // Save the image file path
    }

    await this.companyRepository.save(company);

    return company;
  }

  async filterCompanies(filters: FilterCompanyDto): Promise<Company[]> {
    const query = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.location', 'location')
      .leftJoinAndSelect('company.status', 'status')
      .leftJoinAndSelect('location.city', 'city')
      .leftJoinAndSelect('city.department', 'department')
      .leftJoinAndSelect('department.region', 'region')
      .leftJoinAndSelect('company.employees', 'employee'); // Notez l'alias 'employee'

    if (filters.companyName) {
      query.andWhere('company.name ILIKE :companyName', {
        companyName: `%${filters.companyName}%`,
      });
    }

    if (filters.contactFName) {
      query.andWhere('employee.firstName ILIKE :contactFName', {
        contactFName: `%${filters.contactFName}%`,
      });
    }

    if (filters.contactLName) {
      query.andWhere('employee.lastName ILIKE :contactLName', {
        contactLName: `%${filters.contactLName}%`,
      });
    }

    if (filters.city) {
      query.andWhere('city.name ILIKE :city', { city: `%${filters.city}%` });
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

  async getAllAdmins() {
    return await this.usersService.findAllAdmins();
  }

  async countAllCompanies() {
    return await this.companyRepository.count({
      where: {
        status: { name: In(['Active', 'Inactive']) },
      },
    });
  }
}
