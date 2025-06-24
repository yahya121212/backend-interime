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
  coverImage?: string; // Field for the cover image URL or path

  @Column({ nullable: true })
  image?: string; // Field for the profile image URL or path

  @Column({ nullable: true })
  message?: string;

  @JoinColumn()
  @OneToOne(() => Location, (location) => location.company, {
    onDelete: 'CASCADE',
  })
  location: Location;

  @OneToMany(() => JobOffer, (jobOffer) => jobOffer.company, {
    onDelete: 'CASCADE',
  })
  jobOffers: JobOffer[];

  @OneToMany(() => CompanyEmployee, (employee) => employee.company, {
    onDelete: 'CASCADE',
  })
  employees: CompanyEmployee[];

  @OneToMany(() => Candidate, (candidate) => candidate.company, {
    onDelete: 'CASCADE',
  })
  candidates: Candidate[];

  @OneToOne(() => SocialMedia, (socialMedia) => socialMedia.company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  socialMedia: SocialMedia;

  @OneToMany(() => Activity, (activity) => activity.companies, {
    onDelete: 'CASCADE',
  })
  activities: Activity[];

  @ManyToOne(() => Status, (status) => status.companies, {
    onDelete: 'CASCADE',
  })
  status: Status;

  @ManyToOne(() => CompanyType, (companytype) => companytype.companies, {
    onDelete: 'CASCADE',
  })
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
