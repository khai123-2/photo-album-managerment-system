import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { UserStatus } from '../../constants';
import { BaseEntity } from '../../utils/base.entity';
import { Album } from '../../album/entities/album.entity';
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

  @ManyToMany(() => Album)
  @JoinTable({ name: 'user_album' })
  albums: Album[];

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;
}
