import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/base.entity';
import { User } from '../../user/entities/user.entity';
import { Photo } from 'src/photo/entities/photo.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.comments)
  photo: Photo;

  @DeleteDateColumn()
  deletedAt: Date;
}
