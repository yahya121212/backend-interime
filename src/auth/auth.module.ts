import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { PersonModule } from 'src/person/person.module';
import { LocalStrategy } from '../common/strategies/local-strategy';
import { CompanyEmployeeModule } from 'src/company-employee/company-employee.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { AuthRefreshTokenService } from './refresh-token.service';
import { JwtRefreshStrategy } from 'src/common/strategies/jwt-refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRefreshToken } from './entities/auth-refresh-token.entity';
import { MessageModule } from 'src/message/message.module';
import { OAuth2Client } from 'google-auth-library';


@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthRefreshTokenService,
    JwtRefreshStrategy,
    {
      provide: OAuth2Client,
      useFactory: (configService: ConfigService) => {
        return new OAuth2Client(configService.get<string>('GOOGLE_CLIENT_ID'));
      },
      inject: [ConfigService],
    },
  ],
  imports: [
    TypeOrmModule.forFeature([AuthRefreshToken]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    ConfigModule, // n'oublie pas d'importer ConfigModule pour ConfigService
    PersonModule,
    CompanyEmployeeModule,
    CandidateModule,
    MessageModule,
  ],
})
export class AuthModule {}
