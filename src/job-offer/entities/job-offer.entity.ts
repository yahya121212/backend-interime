import { City } from 'src/city/entities/city.entity';
import { Company } from 'src/company/entities/company.entity';
import { ContractType } from 'src/contract-type/entities/contract-type.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import { Evaluation } from 'src/evaluation/entities/evaluation.entity';
import { Job } from 'src/job/entities/job.entity';
import { Status } from 'src/status/entities/status.entity';
import { VectorColumn } from 'src/common/vector-column';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  JoinTable,
} from 'typeorm';
import { Skill } from 'src/skill/entities/skill.entity';
import { JobOfferLanguage } from 'src/job-offer-language/entities/job-offer-language.entity';
import { SalaryType } from 'src/salary-type/entities/salary-type.entity';
import { CandidateJobOffer } from './CandidateJobOffer.entity';

@Entity()
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 225 })
  title: string;

  @Column({ nullable: true })
  seniority: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'date', nullable: true })
  publicationDate: Date;

  @Column({ default: 0 })
  expectedDuration: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  timeUnit: string;

  @VectorColumn({ nullable: true, length: 1536 })
  embedding: number[];

  @ManyToOne(() => Status, (status) => status.offers)
  status: Status;

  @ManyToOne(() => Company, (company) => company.jobOffers, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @OneToMany(
    () => CandidateJobOffer,
    (candidateJobOffer) => candidateJobOffer.jobOffer,
  )
  @JoinTable()
  candidateJobOffers: CandidateJobOffer[];

  @ManyToOne(() => Job, (job) => job.offers)
  job: Job;

  @ManyToOne(() => ContractType, (contrattype) => contrattype.jobOffers)
  contractType: ContractType;

  @ManyToOne(() => City, (city) => city.jobOffers)
  city: City;

  @ManyToOne(() => SalaryType, (salaryType) => salaryType.jobOffers)
  salaryType: SalaryType;

  @OneToMany(() => Contract, (contract) => contract.jobOffer)
  contracts: Contract[];

  @ManyToMany(() => Skill, (skill) => skill.offers)
  @JoinTable()
  skills: Skill[];

  @OneToMany(
    () => JobOfferLanguage,
    (jobOfferLanguage) => jobOfferLanguage.jobOffer,
  )
  jobOfferLanguages: JobOfferLanguage[];

  @JoinColumn()
  @OneToOne(() => Evaluation, (evaluation) => evaluation.jobOffer)
  evaluation: Evaluation;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
