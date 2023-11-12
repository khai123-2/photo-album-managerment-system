import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PhotoToAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  photoId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  albumId: string;
}
