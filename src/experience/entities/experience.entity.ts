import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postTitle: string; // Title of the position held (e.g., Software Engineer, Accountant)

  @Column()
  companyName: string; // Name of the company or organization

  @Column({ nullable: true, type: 'date' })
  startDate: Date; // Start date of the experience

  @Column({ nullable: true, type: 'date' })
  endDate?: Date; // End date of the experience, if applicable

  @Column({ nullable: true, type: 'text' })
  description?: string; // Description of duties or achievements in the position

  @ManyToOne(() => Candidate, (candidate) => candidate.experiences)
  candidate: Candidate;
}
