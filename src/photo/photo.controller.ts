import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth, CurrentUser, UUIDParam } from 'src/decorators';
import { User } from 'src/user/entities/user.entity';
import { CreatePhotoDto } from './dtos/create-photo.dto';
import { Response } from 'express';
import { PhotoToAlbumDto } from './dtos/photo-to-album.dto';
import { UpdatePhotoDto } from './dtos/update-photo.dto';

@ApiTags('Photo')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get('new-feed')
  @Auth()
  async getNewFeed(@CurrentUser() user: User, @Res() res: Response) {
    const newFeed = await this.photoService.getNewFeed(user.id);
    return res.status(200).send({ data: newFeed });
  }

  @Post()
  @Auth()
  async createPhoto(
    @CurrentUser() user: User,
    @Body() body: CreatePhotoDto,
    @Res() res: Response,
  ) {
    const photo = await this.photoService.createPhoto(user.id, body);
    return res.status(HttpStatus.OK).send({ data: photo });
  }

  @Patch(':photoId')
  @Auth()
  async updatePhoto(
    @CurrentUser() user: User,
    @UUIDParam('photoId') photoId: string,
    @Body() body: UpdatePhotoDto,
    @Res() res: Response,
  ) {
    const result = await this.photoService.updatePhoto(user.id, photoId, body);

    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Delete(':photoId')
  @Auth()
  async deletePhoto(
    @UUIDParam('photoId') photoId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.photoService.deletePhoto(photoId, user.id);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Post('addPhotoToAlbum')
  @Auth()
  async addPhotoToAlbum(
    @CurrentUser() user: User,
    @Body() body: PhotoToAlbumDto,
    @Res() res: Response,
  ) {
    const result = await this.photoService.addPhotoToAlbum(user.id, body);
    if (!result) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Post('like/:photoId')
  @Auth()
  async likeOrUnlikePhoto(
    @UUIDParam('photoId') photoId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.photoService.likeOrUnlikePhoto(photoId, user);
    if (!result) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
