import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base.entity';
import { CommonStatus, UserStatus } from '../../constants';
import { Photo } from '../../photo/entities/photo.entity';

@Entity()
export class Album extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @OneToMany(() => Photo, (photo) => photo.owner)
  photos: Photo[];

  @Column({ type: 'enum', enum: CommonStatus, default: CommonStatus.PUBLIC })
  status: UserStatus;

  @DeleteDateColumn()
  deletedAt: Date;
}
