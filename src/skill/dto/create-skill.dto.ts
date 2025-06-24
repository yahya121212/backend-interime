import { IsOptional, IsString } from 'class-validator';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { CandidateSkill } from '../entities/candidate-skill.entity';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsOptional()
  candidateSkills?: CandidateSkill[];

  @IsOptional()
  offers?: JobOffer[];
}
