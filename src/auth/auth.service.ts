import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PersonService } from 'src/person/person.service';
import { AuthRefreshTokenService } from './refresh-token.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: PersonService,
    private jwtService: JwtService,
    private authRefreshTokenService: AuthRefreshTokenService,
    private oauthClient: OAuth2Client,
    private configService: ConfigService,



  ) {
    this.oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  }
  async verifyGoogleToken(idToken: string) {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken,
      audience: this.configService.get<string>('129135782182-1jn2nr1hpt9fqd0no108noc28gd1d19r.apps.googleusercontent.com'),
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }
    const fullName = payload.name || '';
    const names = fullName.trim().split(' ');

    const firstName = names.shift() || '';
    const lastName = names.join(' ') || '';
    return {
      email: payload.email,
      name: payload.name,
      firstName,
      lastName,
      picture: payload.picture,
    };
  }
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Incorrect Email');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect mot de passe');
    }

    delete user.password;
    return user;
  }

  async login(user: any) {
    const { access_token, refresh_token } =
      await this.authRefreshTokenService.generateTokenPair(user);
    const profile = await this.usersService.findOneByEmail(user.email);
    if (profile) {
      profile.lastConnection = new Date(); // Set the last connection to the current date and time
      await this.usersService.updateUser(profile); // Save the updated user profile
    }
    return {
      token: access_token,
      refreshToken: refresh_token,
      role: user.role,
      email: user.email,
      user: profile,
    };
  }

  async resetPassword(email: any, newPassword: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid token: User not found.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePassword(user.id, hashedPassword);
  }

  async refreshAccessToken(refreshTokenDto): Promise<{ accessToken: string }> {
    const { token } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      );

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
