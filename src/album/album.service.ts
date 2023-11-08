import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateAlbumDto } from './dtos/create-album.dto-';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
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
}
