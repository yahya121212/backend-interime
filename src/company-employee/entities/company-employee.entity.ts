import { Company } from 'src/company/entities/company.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Evaluation } from 'src/evaluation/entities/evaluation.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Message } from 'src/message/entities/message.entity';
import { Person } from 'src/person/entities/person.entity';
import { Position } from 'src/position/entities/position.entity';
import {
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ChildEntity,
} from 'typeorm';

@ChildEntity()
export class CompanyEmployee extends Person {
  @JoinColumn()
  @OneToOne(() => Position, (position) => position.companyEmployee, {
    eager: true,
  })
  position: Position;

  @ManyToOne(() => Company, (company) => company.employees, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @OneToMany(() => JobOffer, (jobOffer) => jobOffer.company, {
    onDelete: 'CASCADE',
  })
  jobOffers: JobOffer[];

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.companyEmployees, {
    onDelete: 'CASCADE',
  })
  evaluation: Evaluation;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
