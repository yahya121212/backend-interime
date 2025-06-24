import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocialMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  linkedIn?: string;

  @OneToOne(() => Company, (company) => company.socialMedia)
  company: string;
}
