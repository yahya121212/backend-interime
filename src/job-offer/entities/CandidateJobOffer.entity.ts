import { Candidate } from 'src/candidate/entities/candidate.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Status } from 'src/status/entities/status.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class CandidateJobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appliedAt: Date;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'text', nullable: true })
  employeeMessage: string | null;

  @ManyToOne(() => Status, (status) => status.candidateOffer)
  status: Status;

  @ManyToOne(() => Candidate, (candidate) => candidate.candidateJobOffers)
  candidate: Candidate;

  @ManyToOne(() => JobOffer, (jobOffer) => jobOffer.candidateJobOffers)
  jobOffer: JobOffer;
}
