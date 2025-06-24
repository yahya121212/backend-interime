import {
  Controller,
  Get,
  HttpException,
  Param,
} from '@nestjs/common';
import { InseeService } from './insee.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('insee')
export class InseeController {
  constructor(private readonly inseeService: InseeService) {}
  
  @Public()
  @Get(':siret')
  async getSiretData(@Param('siret') siret: string) {
    if (!siret) {
      throw new HttpException('Le SIRET est obligatoire', 400);
    }

    try {
      const data = await this.inseeService.fetchSiretData(siret);
      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

}
