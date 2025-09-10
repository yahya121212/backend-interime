import { Candidate } from 'src/candidate/entities/candidate.entity';
import { DocumentType } from 'src/document-type/entities/document-type.entity';
import { Status } from 'src/status/entities/status.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class PersonalDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  issueDate?: Date;

  @Column()
  addedDate: Date;

  @Column()
  description: string;

  @Column()
  link: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.personalDocuments)
  candidate: Candidate;

  @OneToOne(() => DocumentType, (documentType) => documentType.personalDocument)
  @JoinColumn()
  documentType: DocumentType;

  @ManyToOne(() => Status, (status) => status.personalDocuments)
  status: Status;
}
