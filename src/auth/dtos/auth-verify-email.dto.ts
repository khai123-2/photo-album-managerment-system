import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthVerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
