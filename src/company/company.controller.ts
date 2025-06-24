import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RedisService } from 'src/redis/redis.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import {
  APP_EMAIL,
  APP_PHONE,
  COVER_UPLOAD_DIR,
  IMAGE_UPLOAD_DIR,
} from 'src/common/constants';
import { Role } from 'src/common/enums/role.enum';
import { CompanyEmployeeService } from 'src/company-employee/company-employee.service';
import { StatusService } from 'src/status/status.service';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generatedFileName } from 'src/personal-document/document.utils';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyEmployeeService: CompanyEmployeeService,
    // private readonly redisService: RedisService,
    private readonly statusService: StatusService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  @Public()
  @Post()
  async create(@Body('company') createCompanyDto, @Body('user') employee) {
    const user = await this.companyEmployeeService.signUp({
      ...employee,
      role: Role.COMPANYEMPLOYEE,
    });
    const newCompany = await this.companyService.create(createCompanyDto, user);
    if (employee.password === null) {
      const status = await this.statusService.findStatus('Active', 'Company');
      await this.companyService.updateStatus(newCompany?.id, status);
    }
    return {
      status: 'created',
      user: user,
      company: newCompany,
    };
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('inactive')
  async findInactiveCompanies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const REDIS_COMPANIES_KEY = `inactive-companies-Off-${page}-Lim-${limit}`;

    // const companies = await this.redisService.getFromCacheOrDB(
    //   'inactive-companies',
    //   () => this.companyService.findInactiveCompanies(),
    // );
    return await this.companyService.findInactiveCompanies(page, limit);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async findAllCompanies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // const companies = await this.redisService.getFromCacheOrDB(
    //   'companies',
    //   () => this.companyService.findAllCompanies(),
    // );
    return await this.companyService.findAllCompanies(page, limit);
  }

  @Public()
  @Get('siret/:id')
  async siretExistance(@Param('id') siret: string) {
    const company = await this.companyRepository.findOne({
      where: { siret },
    });

    if (company) {
      return {
        exists: true,
        message: `Oups ! Nous avons trouvé un compte avec ce SIRET. Pour débloquer votre situation, contactez notre agence au ${APP_PHONE} ou à ${APP_EMAIL}. Nous sommes là pour vous aider !`,
      };
    }

    return { exists: false };
  }
  @Patch(':companyId/status')
  async updateCompanyStatus(
    @Param('companyId') companyId: string,
    @Body('statusId') statusId: string,
  ) {
    const status = await this.statusService.findOne(statusId);
    return await this.companyService.updateStatus(companyId, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('approve-selected')
  async approveSelectedCompanies(@Body() body: string[]) {
    return await this.companyService.approveSelectedCompanies(body);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id/approve')
  async approveCompany(@Param('id') id: string) {
    return await this.companyService.approveCompany(id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id/reject')
  async rejectCompany(@Param('id') id: string) {
    return await this.companyService.rejectCompany(id);
  }

  @Patch(':id/update')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (file.originalname === 'coverImage') {
            cb(null, COVER_UPLOAD_DIR);
          } else if (file.originalname === 'image') {
            cb(null, IMAGE_UPLOAD_DIR);
          }
        },
        filename: generatedFileName,
      }),
      limits: {
        fileSize: 1000 * 1000 * 15, // 15MB max file size
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(
            new Error('Invalid file type. Only image files are allowed.'),
            false,
          );
        }
      },
    }),
  )
  async updateCompany(
    @Param('id') id: string,
    @Body() companyDto: UpdateCompanyDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<any> {
    const coverImage = files?.find(
      (file) => file.originalname === 'coverImage',
    );
    const image = files?.find((file) => file.originalname === 'image');
    return await this.companyService.updateCompany(
      id,
      companyDto,
      coverImage,
      image,
    );
  }

  @Post('filter')
  async filterCompanies(@Body() filters: FilterCompanyDto) {
    return this.companyService.filterCompanies(filters);
  }
  @Get('active/all')
  async getActiveCompanies() {
    return await this.companyService.getAllCompanies();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }
}
