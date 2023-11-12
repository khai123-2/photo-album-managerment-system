import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { UserService } from 'src/user/user.service';
import { CreatePhotoDto } from './dtos/create-photo.dto';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { PhotoToAlbumDto } from './dtos/photo-to-album.dto';
import { AlbumService } from 'src/album/album.service';
import { UpdatePhotoDto } from './dtos/update-photo.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly userService: UserService,
    private readonly albumService: AlbumService,
    private readonly dataSource: DataSource,
  ) {}

  async getPhoto(
    fields: FindOptionsWhere<Photo> | FindOptionsWhere<Photo>[],
    relationOptions?: string[],
  ): Promise<Photo> {
    return await this.photoRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }
  async createPhoto(id: string, data: CreatePhotoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const currentUser = await this.userService.getUser({ id }, ['photos']);
    try {
      const photo = this.photoRepository.create(data);
      const newPhoto = await this.photoRepository.save(photo);
      currentUser.photos.push(newPhoto);
      await this.userService.saveUser(currentUser);
      await queryRunner.commitTransaction();
      return photo;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  async addPhotoToAlbum(userId: string, data: PhotoToAlbumDto) {
    const { photoId, albumId } = data;
    const photo = await this.getPhoto({ id: photoId }, ['owner']);
    if (!photo) {
      throw new NotFoundException('photo not found');
    }
    if (photo.owner.id !== userId) {
      throw new UnauthorizedException();
    }

    const album = await this.albumService.checkAlbumExists(albumId);
    const userHasJoinAlbum = await this.albumService.hasUserJoinedAlbum(
      userId,
      albumId,
    );
    if (!userHasJoinAlbum) {
      throw new UnauthorizedException();
    }
    photo.album = album;
    return await this.photoRepository.save(photo);
  }

  async updatePhoto(userId: string, photoId: string, data: UpdatePhotoDto) {
    const photo = await this.getPhoto({ id: photoId }, ['owner']);
    if (!photo) {
      throw new NotFoundException('photo not found');
    }
    if (photo.owner.id !== userId) {
      throw new UnauthorizedException();
    }

    return await this.photoRepository.update(photoId, data);
  }

  async deletePhoto(photoId: string, userId: string) {
    const photo = await this.getPhoto({ id: photoId }, ['owner']);
    if (!photo) {
      throw new NotFoundException('photo not found');
    }
    if (photo.owner.id !== userId) {
      throw new UnauthorizedException();
    }
    return await this.photoRepository.delete(photoId);
  }

  async likeOrUnlikePhoto(photoId: string, currentUser: User) {
    const photo = await this.getPhoto({ id: photoId }, ['likes']);
    if (!photo) {
      throw new NotFoundException('photo not found');
    }
    const userIndex = photo.likes.findIndex(
      (user) => user.id === currentUser.id,
    );
    if (userIndex >= 0) {
      photo.likes.splice(userIndex, 1);
    } else {
      photo.likes.push(currentUser);
    }

    return await this.photoRepository.save(photo);
  }

  async getNewFeed(userId: string) {
    const user = await this.userService.getUser({ id: userId }, ['following']);
    const listFollowingId = user.following.map((user) => user.id);
    const photos = await this.photoRepository
      .createQueryBuilder('photo')
      .leftJoinAndSelect('photo.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('photo.likes', 'likes')
      .where('photo.owner.id IN (:...listFollowingId)', { listFollowingId })
      .orderBy('photo.createdAt', 'DESC')
      .getMany();
    return Photo.plainToClassArray(photos);
  }
}
