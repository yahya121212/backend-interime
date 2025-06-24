import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Person } from 'src/person/entities/person.entity';
import { Status } from 'src/status/entities/status.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => Status, (status) => status.messages)
  status: Status;

  @ManyToOne(() => Person, (person) => person.sentMessages, {
    onDelete: 'CASCADE',
  })
  sender: Person; // Sender

  @ManyToOne(() => Person, (person) => person.receivedMessages, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  recipient: Person;

  @ManyToMany(() => Conversation, (conv) => conv.messages, {
    onDelete: 'CASCADE',
  })
  conversation: Conversation;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sendDate: Date; // Date sent
}
