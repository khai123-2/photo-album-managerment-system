import { Body, Controller, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Response } from 'express';
import { CreateAlbumDto } from './dtos/create-album.dto-';
import { User } from 'src/user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, Auth, UUIDParam } from 'src/decorators';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @Auth()
  async createAlbum(
    @CurrentUser() user: User,
    @Body() body: CreateAlbumDto,
    @Res() res: Response,
  ) {
    const album = await this.albumService.createAlbum(user.id, body);
    return res.status(HttpStatus.OK).send({ data: album });
  }

  @Patch('join-album/:albumId')
  @Auth()
  async JoinAlbum(
    @UUIDParam('albumId') albumId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.albumService.joinAlbum(albumId, user.id);
    return res.status(HttpStatus.CREATED).send({ status: 'success' });
  }
}
