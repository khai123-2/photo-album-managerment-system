import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { UserStatus } from '../../constants/user-status';
import { BaseEntity } from '../../utils/base.entity';
import { AlbumStatus } from '../../constants/album-status';

@Entity()
export class Album extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'enum', enum: AlbumStatus, default: AlbumStatus.UNBLOCK })
  status: UserStatus;

  @DeleteDateColumn()
  deletedAt: Date;
}
