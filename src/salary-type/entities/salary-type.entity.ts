import { Contract } from 'src/contract/entities/contract.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class SalaryType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ default: 0 })
  salary: number;

  @OneToMany(() => Contract, (contract) => contract.salaryType)
  contracts: Contract[];

  @OneToMany(() => JobOffer, (offer) => offer.salaryType)
  jobOffers: JobOffer[];

  constructor(salary: number, type: string) {
    this.salary = salary;
    this.type = type;
  }
}
