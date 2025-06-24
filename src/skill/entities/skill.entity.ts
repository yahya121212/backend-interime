import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CandidateSkill } from './candidate-skill.entity';
import { JobOffer } from 'src/job-offer/entities/job-offer.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => CandidateSkill, (candidateSkill) => candidateSkill.skill)
  candidateSkills: CandidateSkill[];

  @OneToMany(() => JobOffer, (offer) => offer.skills)
  offers: JobOffer[];
}
