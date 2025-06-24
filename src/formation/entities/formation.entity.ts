import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Formation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string; // Title of the formation (e.g., Bachelor's Degree, JavaScript Bootcamp)

  @Column()
  institution: string; // Institution or school offering the formation

  @Column({ nullable: true, type: 'date' })
  startDate: Date; // Start date of the formation

  @Column({ nullable: true, type: 'date' })
  endDate?: Date; // End date of the formation, if applicable

  @Column({ nullable: true })
  description?: string; // Optional description of the formation

  @Column({ nullable: true })
  certificateUrl?: string; // URL to a certificate or diploma (if available)

  @Column({ nullable: true })
  type: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.experiences)
  candidate: Candidate;
}
