import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommonStatus } from '../../constants';
import { BaseEntity } from '../../utils/base.entity';
import { User } from '../../user/entities/user.entity';
import { Album } from '../../album/entities/album.entity';
import { Comment } from '../../comment/entities/comment.entity';
@Entity()
export class Photo extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  link: string;

  @ManyToOne(() => User, (user) => user.photos)
  owner: User;

  @ManyToOne(() => Album, (album) => album.photos)
  album: Album;

  @ManyToMany(() => User, (user) => user.likedPhotos)
  @JoinTable()
  likes: User[];

  @OneToMany(() => Comment, (comment) => comment.photo)
  comments: Comment[];

  @Column({ type: 'enum', enum: CommonStatus, default: CommonStatus.PUBLIC })
  status: CommonStatus;

  @DeleteDateColumn()
  deletedAt: Date;
}
