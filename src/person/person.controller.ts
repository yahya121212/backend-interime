import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Param,
  Query,
  HttpException,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('users')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // @Roles('admin')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllP(): Promise<Person[]> {
    return this.personService.findMany();
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: Person) {
    return await this.personService.findOne(user.id);
  }

  @Public()
  @Post('verification-otp')
  async generateEmailVerification(@Body('userId') userId: string) {
    await this.personService.generateEmailVerification(userId);

    throw new HttpException(
      { status: 'success', message: 'Sending email in a moment' },
      HttpStatus.OK,
    );
  }

  @Public()
  @Get('verify/:otp')
  async verifyEmail(@Param('otp') otp: string, @Query('user') user: string) {
    const verified = await this.personService.verifyEmail(user, otp);
    if (verified) {
      throw new HttpException(
        { status: 'success', message: 'Verification success' },
        HttpStatus.OK,
      );
    }
  }
}
