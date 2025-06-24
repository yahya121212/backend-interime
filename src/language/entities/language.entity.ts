import { Candidate } from 'src/candidate/entities/candidate.entity';
import { JobOfferLanguage } from 'src/job-offer-language/entities/job-offer-language.entity';
import { CandidateLanguage } from 'src/skill/entities/candidate-luanguage.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Language name (e.g., English, Spanish)

  @OneToMany(() => CandidateLanguage, (candidateLang) => candidateLang.language)
  candidateLanguages: CandidateLanguage[];

  @OneToMany(() => JobOfferLanguage, (offerLang) => offerLang.language)
  jobOfferLanguages: JobOfferLanguage[];
}
