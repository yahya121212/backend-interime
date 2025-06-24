import { Evaluation } from 'src/evaluation/entities/evaluation.entity';
import { Question } from 'src/question/entities/question.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Question, (question) => question.questionnaire)
  questions: Question[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.questionnaire)
  evaluations: Evaluation[];

  calculateFinalScore(): number {
    return 2;
  }
}
