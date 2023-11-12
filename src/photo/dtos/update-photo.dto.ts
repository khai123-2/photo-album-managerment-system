import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
