import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { UserStatus } from '../../constants';
import { BaseEntity } from '../../utils/base.entity';
import { Album } from '../../album/entities/album.entity';
import { Photo } from '../../photo/entities/photo.entity';
import { Comment } from '../../comment/entities/comment.entity';
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

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => Album)
  @JoinTable({ name: 'user_album' })
  albums: Album[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'follow',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followingId', referencedColumnName: 'id' },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @OneToMany(() => Photo, (photo) => photo.owner)
  photos: Photo[];

  @ManyToMany(() => Photo, (photo) => photo.likes)
  @JoinTable()
  likedPhotos: Photo[];

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;
}
