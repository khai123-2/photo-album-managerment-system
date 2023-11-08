import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserStatus } from 'src/constants/user-status';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserStatus, {
    message:
      'Invalid user status. Valid values are: active, inactive, blocked.',
  })
  status?: UserStatus;
}
