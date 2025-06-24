import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class CompanyType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  desctiption: string;

  @OneToMany(() => Company, (company) => company.companyType)
  companies: Company[];

  constructor(desctiption: string) {
    this.desctiption = desctiption;
  }
}
