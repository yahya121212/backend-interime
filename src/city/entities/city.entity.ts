import { Department } from 'src/department/entities/department.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Location } from 'src/location/entities/location.entity';
import { PostalCode } from 'src/postal-code/entities/postal-code.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 225 })
  name: string;

  @ManyToMany(() => PostalCode, (postalCode) => postalCode.cities)
  postalCodes: PostalCode[];

  @ManyToOne(() => Department, (dep) => dep.cities)
  department: Department;

  @OneToMany(() => Location, (location) => location.city)
  locations: Location[];

  @OneToMany(() => JobOffer, (offer) => offer.city)
  jobOffers: JobOffer[];

  constructor(name: string) {
    this.name = name;
  }
}
