import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyEmployee } from './entities/company-employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { StatusService } from 'src/status/status.service';
import * as bcrypt from 'bcrypt';
import { UpdateCompanyEmployeeDto } from './dto/update-company-employee.dto';
import { EmailService } from 'src/message/email.service';

@Injectable()
export class CompanyEmployeeService {
  constructor(
    @InjectRepository(CompanyEmployee)
    private readonly companyEmployeeRepository: Repository<CompanyEmployee>,
    private readonly statusService: StatusService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(dto) {
    const inactiveStatus = await this.statusService.findStatus(
      'Inactive',
      'User',
    );

    const existingUser = await this.companyEmployeeRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Determine password to use (default or provided)
    const password = dto.password || 'admin1234';
    const saltOrRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    // Create user with hashed password
    const user = this.companyEmployeeRepository.create({
      ...dto,
      password: hashedPassword,
      status: inactiveStatus,
    });

    const newUser = await this.companyEmployeeRepository.save(user);

    const userName = `${dto.firstName} ${dto.lastName}`;

    if (dto.password === null) {
      this.emailService.sendResetPasswordEmail(userName, dto.email);
    }

    return newUser;
  }

  async findAll() {
    return await this.companyEmployeeRepository.find();
  }

  async findLastEmployee(company: Company) {
    return await this.companyEmployeeRepository.findOne({
      where: { company: { id: company.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByEmail(email: string): Promise<CompanyEmployee | null> {
    return await this.companyEmployeeRepository.findOne({
      where: { email },
      relations: [
        'status',
        'company',
        'company.socialMedia',
        'company.status',
        'company.location.postalCode',
        'company.location.city.department.region',
      ],
    });
  }

  async save(companyEmployee: CompanyEmployee) {
    return await this.companyEmployeeRepository.save(companyEmployee);
  }

  async update(id: string, updateCompanyEmployeeDto: UpdateCompanyEmployeeDto) {
    const edited = await this.companyEmployeeRepository.preload({
      id: id,
      ...updateCompanyEmployeeDto,
    });

    return this.companyEmployeeRepository.save(edited);
  }
}
