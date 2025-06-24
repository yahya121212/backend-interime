import { CompanyEmployee } from 'src/company-employee/entities/company-employee.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Questionnaire } from 'src/questionnaire/entities/questionnaire.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string; // Evaluator's comment

  @OneToOne(() => JobOffer, (offer) => offer.evaluation)
  jobOffer: JobOffer; // Job offer related to the evaluation

  @OneToMany(() => CompanyEmployee, (employee) => employee.evaluation)
  companyEmployees: CompanyEmployee[]; // Employee of the company conducting the evaluation

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.evaluations)
  questionnaire: Questionnaire; // Questionnaire used

  // Method to calculate the final score
  calculateScore(): void {
    this.score = this.questionnaire.calculateFinalScore();
  }
}
