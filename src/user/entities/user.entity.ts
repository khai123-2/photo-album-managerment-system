import { Column, Entity } from 'typeorm';
import { UserStatus } from '../../constants/user-status';
import { BaseEntity } from '../../utils/base.entity';
@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  username: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;
}
