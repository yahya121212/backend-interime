import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Person } from 'src/person/entities/person.entity';
import { NO_ACCOUNT_GUARD_KEY } from '../decorators/no-account-guard.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { CompanyEmployeeService } from 'src/company-employee/company-employee.service';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private employeeService: CompanyEmployeeService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const noAccountGuard = this.reflector.getAllAndOverride<boolean>(
      NO_ACCOUNT_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || noAccountGuard) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: Person = request.user;
    const employee = await this.employeeService.findOneByEmail(user.email);

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        `Vous devez vérifier votre compte. Vous avez déjà reçu un mail de vérification, veuillez vérifier votre boîte mail.`,
      );
    }

    if (user.status.name !== 'Active') {
      throw new UnauthorizedException(`Account ${user.status.name}`);
    }

    // Vérification du statut de l'entreprise
    const companyStatus = employee?.company?.status?.name;

    if (companyStatus === 'Pending') {
      throw new UnauthorizedException(
        'Votre entreprise est en attente de validation par un administrateur. Vous recevrez un e-mail une fois votre demande traitée.',
      );
    }

    if (companyStatus === 'Inactive') {
      throw new UnauthorizedException(
        "Votre entreprise est désactivée. Veuillez contacter l'équipe support pour plus d'informations.",
      );
    }

    if (companyStatus === 'Rejected') {
      throw new ForbiddenException({
        error: 'Account rejected',
        message:
          "Votre demande de création de compte a été rejetée. Veuillez contacter l’agence au 01 40 34 10 45 pour plus d'informations.",
      });
    }

    return user.status.name === 'Active' && !!user.emailVerifiedAt;
  }
}
