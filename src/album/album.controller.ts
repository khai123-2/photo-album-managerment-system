import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Response } from 'express';
import { CreateAlbumDto } from './dtos/create-album.dto-';
import { User } from 'src/user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, Auth, UUIDParam } from 'src/decorators';
import { UpdateAlbumDto } from './dtos/update-album.dto';

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

  @Patch(':albumId')
  @Auth()
  async updateAlbum(
    @UUIDParam('albumId') albumId: string,
    @CurrentUser() user: User,
    @Body() body: UpdateAlbumDto,
    @Res() res: Response,
  ) {
    const result = await this.albumService.updateAlbum(albumId, user.id, body);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.CREATED).send({ status: 'success' });
  }

  @Delete(':albumId')
  @Auth()
  async deleteAlbum(
    @UUIDParam('albumId') albumId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.albumService.deleteAlbum(albumId, user.id);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.CREATED).send({ status: 'success' });
  }
}
