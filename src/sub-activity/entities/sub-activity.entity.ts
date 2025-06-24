import { Activity } from 'src/activity/entities/activity.entity';
import { Job } from 'src/job/entities/job.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class SubActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Job, (job) => job.subActivity)
  jobs: Job[];

  @ManyToOne(() => Activity, (activity) => activity.subActivities)
  activity: Activity;
}
