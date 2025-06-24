import { City } from 'src/city/entities/city.entity';
import { Location } from 'src/location/entities/location.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class PostalCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar'})
  code: string;

  @ManyToMany(() => City, (city) => city.postalCodes)
  @JoinTable()
  cities: City[];

  @OneToMany(() => Location, (location) => location.postalCode)
  locations: Location[];
  constructor(code: string) {
    this.code = code;
  }
}
