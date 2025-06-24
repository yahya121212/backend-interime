import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MoreThan, Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { generateOtp } from './utils/otp.util';

// You can refactor this to support other verifications: password reset, etc

@Injectable()
export class VerificationService {
  // Minimum interval between requests
  // Feel free to implement robust throthling/security
  private readonly minRequestIntervalMinutes = 1;
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(Verification)
    private tokenRepository: Repository<Verification>,
  ) {}

  async generateOtp(userId: string, size = 6): Promise<string> {
    const now = new Date();

    // Check if a token was requested too recently
    // Feel free to implement robust throthling/security
    const recentToken = await this.tokenRepository.findOne({
      where: {
        userId,
        createdAt: MoreThan(
          new Date(now.getTime() - this.minRequestIntervalMinutes * 60 * 1000),
        ),
      },
    });

    if (recentToken) {
      throw new UnprocessableEntityException(
        'Please wait a minute before requesting a new token.',
      );
    }

    const otp = generateOtp(size);
    const hashedToken = await bcrypt.hash(otp, this.saltRounds);

    const tokenEntity = this.tokenRepository.create({
      userId,
      token: hashedToken,
      expiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    });

    // potential issues
    await this.tokenRepository.delete({ userId });

    await this.tokenRepository.save(tokenEntity);

    return otp;
  }

  async validateOtp(userId: string, token: string): Promise<boolean> {
    const validToken = await this.tokenRepository.findOne({
      where: { userId, expiresAt: MoreThan(new Date()) },
    });

    if (!validToken || !(await bcrypt.compare(token, validToken.token))) {
      throw new BadRequestException(
        {
          error: 'Invalid token',
          message:
            "Le lien d'activation est invalide. Veuillez vérifier l'email ou demander un nouvel email d'activation.",
        }
      );
    }

    await this.tokenRepository.remove(validToken);
    return true;
  }
}
