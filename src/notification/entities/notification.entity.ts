import { Person } from 'src/person/entities/person.entity';
import { Status } from 'src/status/entities/status.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string; // Type of notification (New message, Job posted, etc.)

  @Column()
  content: string; // Content of the notification

  @Column()
  targetLink: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @JoinTable()
  @ManyToMany(() => Person, (person) => person.notifications)
  users: Person[]; // Reference to the recipient user

  @ManyToOne(() => Status, (status) => status.notifications)
  status: Status; // Status of the notification (Sent, Read)
}
