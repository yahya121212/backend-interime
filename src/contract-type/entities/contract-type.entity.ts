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
export class ContractType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 225 })
  description: string; // Description of the contract type, e.g., "Permanent", "Temporary", "Interim"

  @OneToOne(() => Contract, (contract) => contract.contractType)
  contract: Contract;
  
  @Column({ type: 'boolean', default: false })
  isRenewable: boolean;

  @OneToMany(() => JobOffer, (offer) => offer.contractType)
  jobOffers: JobOffer[];

  constructor(description: string) {
    this.description = description;
  }
}
