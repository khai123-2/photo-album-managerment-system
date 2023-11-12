import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonStatus } from 'src/constants';

export class UpdateAlbumDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CommonStatus, {
    message: 'Invalid album status. Valid values are: 0, 1, 2.',
  })
  status?: CommonStatus;
}
