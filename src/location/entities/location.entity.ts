import { Alert } from 'src/alert/entities/alert.entity';
import { City } from 'src/city/entities/city.entity';
import { Company } from 'src/company/entities/company.entity';
import { Person } from 'src/person/entities/person.entity';
import { PostalCode } from 'src/postal-code/entities/postal-code.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @ManyToOne(() => PostalCode, (postalCode) => postalCode.locations)
  postalCode: PostalCode;
  
  @ManyToOne(() => City, (city) => city.locations)
  city: City;

  @OneToOne(() => Alert, (alert) => alert.location)
  @JoinColumn()
  alert?: Alert;

  @OneToMany(() => Person, (person) => person.location)
  candidates?: Person[];

  @OneToOne(() => Company, (company) => company.location)
  company?: Company;
}
