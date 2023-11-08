import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  newPassword: string;
}
