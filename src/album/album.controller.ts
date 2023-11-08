import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Request, Response } from 'express';
import { CreateAlbumDto } from './dtos/create-album.dto-';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createAlbum(
    @Req() req: Request,
    @Body() body: CreateAlbumDto,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    const album = await this.albumService.createAlbum(user.id, body);
    return res.status(HttpStatus.OK).send({ data: album });
  }
}
