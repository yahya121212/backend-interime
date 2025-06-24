import { City } from 'src/city/entities/city.entity';
import { Region } from 'src/region/entities/region.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 225 })
  name: string;

  @OneToMany(() => City, (city) => city.department)
  cities: City[];

  @ManyToOne(() => Region, (reg) => reg.departments)
  region: Region;
  constructor(name: string) {
    this.name = name;
  }
}
