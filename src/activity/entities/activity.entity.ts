import { Company } from 'src/company/entities/company.entity';
import { SubActivity } from 'src/sub-activity/entities/sub-activity.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => SubActivity, (subActivity) => subActivity.activity)
  subActivities: SubActivity[];

  @ManyToMany(() => Company, (company) => company.activities)
  @JoinTable()
  companies: Company[];
}
