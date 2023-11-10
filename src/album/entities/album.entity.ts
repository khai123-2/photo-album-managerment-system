import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { BaseEntity } from '../../utils/base.entity';
import { AlbumStatus, UserStatus } from '../../constants';

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
