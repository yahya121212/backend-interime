import { Company } from 'src/company/entities/company.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import { Experience } from 'src/experience/entities/experience.entity';
import { Formation } from 'src/formation/entities/formation.entity';
import { CandidateJobOffer } from 'src/job-offer/entities/CandidateJobOffer.entity';
import { Job } from 'src/job/entities/job.entity';
import { Person } from 'src/person/entities/person.entity';
import { PersonalDocument } from 'src/personal-document/entities/personal-document.entity';
import { CandidateLanguage } from 'src/skill/entities/candidate-luanguage.entity';
import { CandidateSkill } from 'src/skill/entities/candidate-skill.entity';
import {
  Column,
  ChildEntity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@ChildEntity()
export class Candidate extends Person {
  @Column({ nullable: true, default: null })
  profileUpdatedAt?: Date;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => Contract, (contract) => contract.candidates, {
    onDelete: "SET NULL", // le contrat reste
  })
  contract: Contract;

  @OneToMany(() => PersonalDocument, (document) => document.candidate, {

    onDelete: "SET NULL", // le contrat reste
  })
  personalDocuments: PersonalDocument[];

  @OneToMany(() => CandidateSkill, (candidateSkill) => candidateSkill.candidate, {

    onDelete: "SET NULL", // le contrat reste
  })
  candidateSkills: CandidateSkill[];

  @OneToMany(() => CandidateJobOffer, (candidateJobOffer) => candidateJobOffer.candidate, {

    onDelete: "SET NULL", // le contrat reste
  })
  candidateJobOffers: CandidateJobOffer[];

  @ManyToOne(() => Company, (company) => company.candidates, {
    onDelete: "SET NULL", // la société reste
  })
  company: Company;

  @OneToMany(() => CandidateLanguage, (candidateLang) => candidateLang.candidate, {

    onDelete: "SET NULL", // le contrat reste
  })
  candidateLanguages: CandidateLanguage[];

  @OneToMany(() => Experience, (exp) => exp.candidate, {
    onDelete: "SET NULL", // supprime le candidat mais garde les expériences
  })
  experiences: Experience[];

  @OneToMany(() => Formation, (formation) => formation.candidate, {

    onDelete: "SET NULL", // le contrat reste
  })
  formations: Formation[];

  @ManyToMany(() => Job, (job) => job.candidates)
  @JoinTable()
  jobs: Job[];
}

