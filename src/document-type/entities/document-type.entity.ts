import { PersonalDocument } from 'src/personal-document/entities/personal-document.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DocumentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => PersonalDocument, (document) => document.documentType)
  @JoinColumn()
  personalDocument;
}
