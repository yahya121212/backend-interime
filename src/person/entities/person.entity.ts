import { Alert } from 'src/alert/entities/alert.entity';
import { Role } from 'src/common/enums/role.enum';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Location } from 'src/location/entities/location.entity';
import { Message } from 'src/message/entities/message.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Status } from 'src/status/entities/status.entity';
import { VectorColumn } from 'src/common/vector-column';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  age?: number;

  @Column({ default: Role.CANDIDATE })
  role: Role;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ nullable: true })
  profileTitle?: string;

  @Column({ nullable: true })
  aiId?: string;

  @VectorColumn({ nullable: true, length: 1536 })
  embedding: number[];

  @OneToMany(() => Message, (message) => message.sender, {
    onDelete: 'CASCADE',
  })
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.recipient, {
    onDelete: 'CASCADE',
  })
  receivedMessages: Message[];

  @JoinTable()
  @ManyToMany(() => Conversation, (conv) => conv.participants, {
    onDelete: 'CASCADE',
  })
  conversations: Conversation[];

  @OneToMany(() => Alert, (alert) => alert.user, {
    onDelete: 'CASCADE',
  })
  alerts: Alert[];

  @ManyToMany(() => Notification, (notification) => notification.users, {
    onDelete: 'CASCADE',
  })
  notifications: Notification[];

  @JoinColumn()
  @ManyToOne(() => Location, (location) => location.candidates, {
    onDelete: 'CASCADE',
  })
  location: Location;

  @JoinColumn()
  @ManyToOne(() => Status, (status) => status.users, {
    onDelete: 'CASCADE',
  })
  status: Status;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true }) // Allow null for users who haven't logged in yet
  lastConnection: Date;

  calculerAge(): number {
    if (!this.birthDate) {
      return null;
    }
    const today = new Date();
    const birthDateObj = new Date(this.birthDate);

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  }

  @BeforeInsert()
  @BeforeUpdate()
  setAge() {
    this.age = this.calculerAge();
  }
}
