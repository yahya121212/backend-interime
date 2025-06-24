import { AgencyEmployee } from 'src/agency-employee/entities/agencyEmployee.entity';
import { CompanyEmployee } from 'src/company-employee/entities/company-employee.entity';
import { Right } from 'src/right/entities/right.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string; // Job title (e.g., Salesperson, Secretary)

  @Column()
  description: string; // Description of job responsibilities

  @OneToOne(
    () => CompanyEmployee,
    (companyEmployee) => companyEmployee.position,
  )
  companyEmployee: CompanyEmployee;

  @OneToOne(
    () => AgencyEmployee,
    (agencyEmployee) => agencyEmployee.position,
  )
  agencyEmployee: AgencyEmployee;

  @JoinColumn()
  @OneToMany(() => Right, (right) => right.position)
  rights: Right[];
  
}
