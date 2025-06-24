import { Candidate } from 'src/candidate/entities/candidate.entity';
import { ContractType } from 'src/contract-type/entities/contract-type.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Job } from 'src/job/entities/job.entity';
import { SalaryType } from 'src/salary-type/entities/salary-type.entity';
import { Status } from 'src/status/entities/status.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  salary: number;

  @Column({ type: 'boolean', default: false })
  isRenewable: boolean;

  @Column({ type: 'text', nullable: true })
  terms: string; // Conditions spécifiques du contrat

  @ManyToOne(() => JobOffer, (jobOffer) => jobOffer.contracts)
  jobOffer: JobOffer;

  @OneToMany(() => Candidate, (candidate) => candidate.contract)
  candidates: Candidate[];

  @OneToOne(() => ContractType, (contractType) => contractType.contract)
  @JoinColumn()
  contractType: ContractType;

  @ManyToOne(() => SalaryType, (salaryType) => salaryType.contracts)
  salaryType: SalaryType;

  @ManyToOne(() => Status, (status) => status.contracts)
  status: Status;

  @OneToOne(() => Job, (job) => job.contrat)
  job: Job;
}
