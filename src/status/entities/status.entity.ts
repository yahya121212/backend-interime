import { Alert } from 'src/alert/entities/alert.entity';
import { Company } from 'src/company/entities/company.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { CandidateJobOffer } from 'src/job-offer/entities/CandidateJobOffer.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';
import { Message } from 'src/message/entities/message.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Person } from 'src/person/entities/person.entity';
import { PersonalDocument } from 'src/personal-document/entities/personal-document.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  context: string; // Type of status (e.g., "Mission", "Document", "Evaluation", "Contract", "Conversation")

  @OneToMany(() => Contract, (contract) => contract.status)
  contracts: Contract[];

  @OneToMany(() => PersonalDocument, (document) => document.status)
  personalDocuments: PersonalDocument[];

  @OneToMany(() => Person, (person) => person.status)
  users: Person[];

  @OneToMany(() => JobOffer, (offer) => offer.status)
  offers: JobOffer[];

  @OneToMany(() => CandidateJobOffer, (offer) => offer.status)
  candidateOffer: CandidateJobOffer[];

  @OneToMany(() => Conversation, (conversation) => conversation.status)
  conversations: Conversation[];

  @OneToMany(() => Notification, (notification) => notification.status)
  notifications: Notification[];

  @OneToMany(() => Message, (message) => message.status)
  messages: Message[];

  @OneToMany(() => Alert, (alert) => alert.status)
  alerts: Alert[];

  @OneToMany(() => Company, (company) => company.status)
  companies: Company[];

  static getMissionStatuses(): string[] {
    return ['Pending', 'In Progress', 'Completed'];
  }

  static getDocumentStatuses(): string[] {
    return ['Up-to-date', 'Needs Update'];
  }

  static getContractStatuses(): string[] {
    return ['Signed', 'Pending', 'Active'];
  }

  static getConversationStatuses(): string[] {
    return ['Active', 'Archived', 'Closed'];
  }
}
