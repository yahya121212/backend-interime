import { Candidate } from 'src/candidate/entities/candidate.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Language } from 'src/language/entities/language.entity';
@Entity()
export class CandidateLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.candidateLanguages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @ManyToOne(() => Language, (lang) => lang.candidateLanguages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ type: 'varchar', length: 50, nullable: true })
  level: string;
}
