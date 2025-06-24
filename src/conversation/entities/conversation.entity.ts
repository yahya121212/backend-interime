import { Message } from 'src/message/entities/message.entity';
import { Person } from 'src/person/entities/person.entity';
import { Status } from 'src/status/entities/status.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  type: string;

  @ManyToMany(() => Person, (person) => person.conversations)
  participants: Person[];

  @ManyToMany(() => Message, (message) => message.conversation)
  @JoinTable()
  messages: Message[];

  @ManyToOne(() => Status, (status) => status.conversations)
  @JoinColumn()
  status: Status;

  constructor(participants: Person[]) {
    this.participants = participants;
  }

  addMessage(message: Message): void {
    this.messages.push(message);
  }

  closeConversation(): void {}
}
