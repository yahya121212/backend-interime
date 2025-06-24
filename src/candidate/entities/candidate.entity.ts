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

  @ManyToOne(() => Contract, (contract) => contract.candidates)
  contract: Contract;

  @OneToMany(() => PersonalDocument, (document) => document.candidate, {
    cascade: true,
  })
  personalDocuments: PersonalDocument[];

  @OneToMany(() => CandidateSkill, (candidateSkill) => candidateSkill.candidate)
  candidateSkills: CandidateSkill[];

  @OneToMany(
    () => CandidateJobOffer,
    (candidateJobOffer) => candidateJobOffer.candidate,
  )
  candidateJobOffers: CandidateJobOffer[];

  @ManyToOne(() => Company, (company) => company.candidates)
  company: Company;

  @OneToMany(
    () => CandidateLanguage,
    (candidateLang) => candidateLang.candidate,
  )
  candidateLanguages: CandidateLanguage[];

  @OneToMany(() => Experience, (exp) => exp.candidate, { cascade: true })
  experiences: Experience[];

  @OneToMany(() => Formation, (formation) => formation.candidate, {
    cascade: true,
  })
  formations: Formation[];

  @ManyToMany(() => Job, (job) => job.candidates)
  @JoinTable()
  jobs: Job[];
}
