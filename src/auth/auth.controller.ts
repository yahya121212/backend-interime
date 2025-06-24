import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { CandidateService } from 'src/candidate/candidate.service';
import { Throttle } from '@nestjs/throttler';
import { Response, Request as ExpressRequest } from 'express';
import { AuthRefreshTokenService } from './refresh-token.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PersonService } from 'src/person/person.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from 'src/message/email.service';
import { Candidate } from 'src/candidate/entities/candidate.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private candidateService: CandidateService,
    private emailService: EmailService,
    private configService: ConfigService,
    private userService: PersonService,
  ) { }

  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const user = await this.candidateService.signUp({
      role: Role.CANDIDATE,
      ...body,
    });
    return user;
  }
  logger = new Logger();

  @Public()
  @Post('google')
  async loginWithGoogle(@Body('idToken') idToken: string) {


    const googleUser = await this.authService.verifyGoogleToken(idToken);

    // 1. Vérifier si l'utilisateur existe dans la base
    let user = await this.candidateService.findByEmail(googleUser.email);

    // 2. S'il n'existe pas, le créer
    if (!user) {
      user = await this.candidateService.signUpGlg({
        email: googleUser.email,
        fullName: googleUser.name,
        avatar: googleUser.picture,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        role: Role.CANDIDATE,
        provider: 'google', // facultatif
      });
    }

    // 3. Retourner le même JWT que pour le login classique
    return this.authService.login(user);
  }
  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  @Public()
  @Post('check-password-token')
  async validatePasswordToken(@Body('token') token: string) {
    try {
      const secret = this.configService.get('jwtRefreshSecret');
      jwt.verify(token, secret);

      return { message: 'Token est valide' };
    } catch (error) {
      throw new BadRequestException('Token invalide ou expiré.');
    }
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { password, token } = resetPasswordDto;
    try {
      const secret = this.configService.get('jwtRefreshSecret');
      const decoded = jwt.verify(token, secret);
      const email = decoded['sub'];

      await this.authService.resetPassword(email, password);
      return { message: 'Password reset successfully.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Post('resend-reset-password-email')
  async resendResetPasswordEmail(@Body() body) {
    const decoded = jwt.decode(body.token, { complete: true }) as {
      payload: { sub: string };
    };

    if (!decoded || !decoded.payload || !decoded.payload.sub) {
      throw new InternalServerErrorException('Invalid Token.');
    }

    const email = decoded.payload.sub;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException("L'utilisateur avec cet email n'existe pas");
    }

    const userName = `${user.firstName} ${user.lastName}`;

    await this.emailService.sendResetPasswordEmail(userName, email);

    return { message: 'Reset password email resent successfully.' };
  }

  @Post('validate-token')
  async validateToken(@Request() req: ExpressRequest, @Res() res: Response) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ valid: false, message: 'Token not provided' });
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = jwt.verify(token, secret);
      return res.status(200).json({ valid: true, decoded });
    } catch (error) {
      return res.status(401).json({ valid: false, message: 'Invalid token' });
    }
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    const email = body.email;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException("L'utilisateur avec cet email n'existe pas");
    }

    const userName = `${user.firstName} ${user.lastName}`;

    await this.emailService.sendResetPasswordEmail(userName, email);

    return { message: 'Reset password email resent successfully.' };
  }
}
