import { Region } from 'src/region/entities/region.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 225 })
  name: string;

  @OneToMany(() => Region, (reg) => reg.country, {
    eager: true,
  })
  regions: Region[];
}
