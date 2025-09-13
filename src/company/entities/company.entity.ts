import { Activity } from 'src/activity/entities/activity.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { CompanyEmployee } from 'src/company-employee/entities/company-employee.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Location } from 'src/location/entities/location.entity';
import { Status } from 'src/status/entities/status.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyType } from './company-type.entity';
import { SocialMedia } from 'src/social-media/entities/social-media.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  siret: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  naf: string;

  @Column()
  nafTitle: string;

  @Column()
  category: string;

  @Column()
  workforce: number;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  message?: string;

  /** 1–1 relation with Location */
  @OneToOne(() => Location, (location) => location.company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  /** 1–N relation with JobOffer */
  @OneToMany(() => JobOffer, (jobOffer) => jobOffer.company, {
    onDelete: 'CASCADE',
  })
  jobOffers: JobOffer[];

  /** 1–N relation with CompanyEmployee */
  @OneToMany(() => CompanyEmployee, (employee) => employee.company, {
    onDelete: 'CASCADE',
  })
  employees: CompanyEmployee[];

  /** 1–N relation with Candidate */
  @OneToMany(() => Candidate, (candidate) => candidate.company, {
    onDelete: 'SET NULL',
  })
  candidates: Candidate[];

  /** 1–1 relation with SocialMedia */
  @OneToOne(() => SocialMedia, (socialMedia) => socialMedia.company, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'socialMediaId' })
  socialMedia: SocialMedia;

  /** 1–N relation with Activity */
  @OneToMany(() => Activity, (activity) => activity.companies, {
    onDelete: 'CASCADE',
  })
  activities: Activity[];

  /** N–1 relation with Status */
  @ManyToOne(() => Status, (status) => status.companies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'statusId' })
  status: Status;

  /** N–1 relation with CompanyType */
  @ManyToOne(() => CompanyType, (companytype) => companytype.companies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyTypeId' })
  companyType: CompanyType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
