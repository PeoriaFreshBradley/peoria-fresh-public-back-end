import { BaseEntity } from 'src/abstraction/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 2048,
  })
  token: string;

  // expiration
  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  replacedAt: Date;
}
