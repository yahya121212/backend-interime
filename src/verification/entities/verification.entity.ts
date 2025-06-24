import { Person } from 'src/person/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id: number;

  // Although ManyToOne will create a column named userId,
  // I want a Verification.userId ability hence this
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Person, {
    onDelete: 'CASCADE',
  })
  // @JoinColumn({ name: 'userIdd' }) // will be userId by default
  user: Person;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
