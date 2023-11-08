import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;
}
