import { Position } from 'src/position/entities/position.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Right {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 225 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Position, (position) => position.rights)
  position: Position;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }
}
