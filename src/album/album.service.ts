import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dtos/create-album.dto-';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async createAlbum(id: string, data: CreateAlbumDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const currentUser = await this.userService.getUser({ id }, ['albums']);
    try {
      const album = await this.albumRepository.save(data);
      currentUser.albums.push(album);
      await this.userService.saveUser(currentUser);
      await queryRunner.commitTransaction();
      return album;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }
  async getAlbum(
    fields: FindOptionsWhere<Album> | FindOptionsWhere<Album>[],
    relationOptions?: string[],
  ): Promise<Album> {
    return await this.albumRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async joinAlbum(albumId: string, userId: string) {
    const album = await this.getAlbum({ id: albumId });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    const user = await this.userService.getUser({ id: userId }, ['albums']);

    const userHasJoinAlbum = user.albums.find((album) => album.id === albumId);
    if (userHasJoinAlbum) {
      throw new BadRequestException();
    }
    user.albums.push(album);
    await this.userService.saveUser(user);
  }
}
