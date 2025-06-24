import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("seeds")
export class SeedStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isSeeded: boolean;
}
