import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth/auth.service';
import { CompanyEmployeeService } from 'src/company-employee/company-employee.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private employeeService: CompanyEmployeeService,
  ) {
    // In this example, the passport-local strategy by default expects
    // properties called username and password in the request body.
    // Pass an options object to specify different property names,
    // for example: super({ usernameField: 'email' })
    super({ usernameField: 'email' });
  }

  // For the local-strategy, Passport expects a validate() method with
  // the following signature: validate(username: string, password:string): any
  // The validate method in LocalStrategy is where the actual validation of user credentials happens, whereas
  // in our JWT Strategy, we called the validate method after the token's validity has been confirmed.
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const employee = await this.employeeService.findOneByEmail(user.email);

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        `Vous devez vérifier votre compte. Vous avez déjà reçu un mail de vérification, veuillez vérifier votre boîte mail.`,
      );
    }

    const companyStatus = employee?.company?.status?.name;

    if (companyStatus === 'Pending') {
      throw new UnauthorizedException(
        'Votre entreprise est en attente de validation par un administrateur. Vous recevrez un e-mail une fois votre demande traitée.',
      );
    }

    if (companyStatus === 'Rejected') {
      throw new ForbiddenException({
        error: 'Account rejected',
        message:
          "Votre demande de création de compte a été rejetée. Veuillez contacter l’agence au 01 40 34 10 45 pour plus d'informations.",
      });
    }

    if (companyStatus === 'Inactive') {
      throw new UnauthorizedException(
        "Votre entreprise est désactivée. Veuillez contacter l'équipe support pour plus d'informations.",
      );
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
