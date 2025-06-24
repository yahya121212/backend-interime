import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationService } from 'src/verification/verification.service';
import { EmailService } from 'src/message/email.service';
import { Status } from 'src/status/entities/status.entity';
import { ANGULAR_VIEW_lINK } from 'src/common/constants';
import { Role } from 'src/common/enums/role.enum';
import { StatusService } from 'src/status/status.service';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private verificationTokenService: VerificationService,
    private emailService: EmailService,
    private readonly statusService: StatusService,
  ) {}

  async create(user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    birthDate: Date;
    role: Role;
    status: Status;
    emailVerifiedAt: Date;
  }): Promise<Person> {
    const person = this.personRepository.create(user);
    return await this.personRepository.save(person);
  }

  async findOne(id: string): Promise<Person> {
    return await this.personRepository.findOne({
      where: { id },
      relations: [
        'status',
        'company',
        'company.socialMedia',
        'company.location.postalCode',
        'company.location.city.department.region',
      ],
    });
  }

  async findOneByEmail(email) {
    return await this.personRepository.findOne({
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

  async findMany() {
    return await this.personRepository.find({
      relations: ['status', 'company'],
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.personRepository.update(userId, { password: hashedPassword });
  }

  async generateEmailVerification(userId: string) {
    const user = await this.personRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new ConflictException({
        error: 'Account already activated',
        message: 'Votre compte est déjà activé. Veuillez vous connecter.',
      });
    }

    const otp = await this.verificationTokenService.generateOtp(user.id);

    const verificationLink = `${ANGULAR_VIEW_lINK}?otp=${otp}&user=${user.id}`;

    const fullName = `${user.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1).toLowerCase()} ${user?.lastName?.toUpperCase()}`;

    this.emailService.sendEmail({
      subject: 'Interim - Account Verification',
      recipients: [{ name: fullName, address: user.email }],
      html: `
      <p>Bonjour <strong>${user.lastName}</strong>,</p>

    <p>Merci de vous être inscrit sur notre plateforme <strong>Intérim-Online</strong>.</p>

    <p>Pour activer votre compte et permettre à notre équipe de finaliser votre demande, veuillez cliquer sur le bouton ci-dessous :</p>

    <p style="text-align: center;">
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Activer mon compte</a>
    </p>

    <p>Ce lien est valable pendant 48 heures. Une fois votre activation validée, notre administrateur examinera votre demande. Vous recevrez un email de confirmation une fois votre compte activé.</p>

    <p>À bientôt sur <strong>Intérim-Online</strong> !</p>

    <p>L’équipe support</p>`,
    });
  }

  async verifyEmail(userId: string, token: string) {
    const invalidMessage = 'Invalid or expired OTP';
    const user = await this.personRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException('Account already verified');
    }

    const isValid = await this.verificationTokenService.validateOtp(
      user.id,
      token,
    );

    if (!isValid) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    const activeStatus = await this.statusService.findStatus('Active', 'User');

    user.emailVerifiedAt = new Date();
    user.status = activeStatus;

    await this.personRepository.save(user);

    return true;
  }

  async findAllAdmins() {
    return await this.personRepository.find({ where: { role: Role.ADMIN } });
  }

  async save(person: Person) {
    await this.personRepository.save(person);
  }

  async updateUser(user: any): Promise<any> {
    return this.personRepository.save(user);
  }
}
