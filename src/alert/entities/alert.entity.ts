import { Location } from 'src/location/entities/location.entity';
import { Person } from 'src/person/entities/person.entity';
import { Status } from 'src/status/entities/status.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profession: string;

  @Column()
  position: string;

  @OneToOne(() => Location, (location) => location.alert)
  location: Location;

  @ManyToOne(() => Person, (person) => person.alerts)
  user: Person;

  @ManyToOne(() => Status, (status) => status.alerts)
  status: Status;

  @Column()
  notificationChannel: string; // Notification channel (Internal, Email)
}
