import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { SubActivity } from 'src/sub-activity/entities/sub-activity.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', length: 225 })
  name: string;

  @ManyToOne(() => SubActivity,(subactivity)=>subactivity.jobs)
  subActivity: SubActivity;

  @OneToMany(() => JobOffer, (offer) => offer.job)
  offers: JobOffer[];

  @OneToOne(() => Contract, (contract) => contract.job)
  contrat: Contract;

  @ManyToMany(() => Candidate, (candidate) => candidate.jobs)
  candidates: Candidate[];
}
