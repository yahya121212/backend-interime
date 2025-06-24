import { Person } from 'src/person/entities/person.entity';
import { Position } from 'src/position/entities/position.entity';
import {
  ChildEntity,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@ChildEntity()
export class AgencyEmployee extends Person {
  @JoinColumn()
  @OneToOne(() => Position, (position) => position.agencyEmployee, {
    cascade: true,
    eager: true,
  })
  position: Position;

}
