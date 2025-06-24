import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Language } from 'src/language/entities/language.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class JobOfferLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobOffer, (jobOffer) => jobOffer.jobOfferLanguages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_offer_id' })
  jobOffer: JobOffer;

  @ManyToOne(() => Language, (lang) => lang.jobOfferLanguages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ type: 'varchar', length: 50, nullable: true })
  level: string;
}
