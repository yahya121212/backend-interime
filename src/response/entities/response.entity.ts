import { Question } from 'src/question/entities/question.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Response {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string; // Text of the response

  @Column()
  score: number;

  @Column({ type: 'float' })
  value: number; // Numeric value
  
  @ManyToOne(() => Question, (question) => question.possibleResponses)
  question: Question;

  constructor(text: string, value: number) {
    this.text = text;
    this.value = value;
  }
}
