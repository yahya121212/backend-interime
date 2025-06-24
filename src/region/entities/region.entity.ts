import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from 'src/department/entities/department.entity';
import { Country } from 'src/country/entities/country.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 225 })
  name: string;

  @OneToMany(() => Department, (dep) => dep.region)
  departments: Department[];

  @ManyToOne(() => Country, (country) => country.regions)
  country: Country;

  constructor(name: string) {
    this.name = name;
  }
}
