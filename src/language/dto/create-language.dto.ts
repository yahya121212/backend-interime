import { IsOptional, IsString } from 'class-validator';
import { JobOfferLanguage } from 'src/job-offer-language/entities/job-offer-language.entity';
import { CandidateLanguage } from 'src/skill/entities/candidate-luanguage.entity';

export class CreateLanguageDto {
  @IsString()
  name: string;

  @IsOptional()
  jobOfferLanguages: JobOfferLanguage[];
  
  @IsOptional()
  candidateLanguages: CandidateLanguage[];
}
