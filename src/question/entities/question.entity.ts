import { Questionnaire } from 'src/questionnaire/entities/questionnaire.entity';
import { Response } from 'src/response/entities/response.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string; // Text of the question

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions)
  questionnaire: Questionnaire;

  @OneToMany(() => Response, (response) => response.question) // Assuming Response has a relation back to Question
  possibleResponses: Response[]; // List of possible answers

  constructor(title: string) {
    this.title = title;
    // this.possibleResponses = [];
  }

  // Method to assign a score based on the chosen response
  assignScore(chosenResponse: Response): number {
    // Logic to assign a score based on the selected response
    return chosenResponse.score;
  }
}
