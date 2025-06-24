import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';

@Entity({ name: 'auth_refresh_tokens' })
export class AuthRefreshToken {
  @PrimaryColumn({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Person, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Person;
}
