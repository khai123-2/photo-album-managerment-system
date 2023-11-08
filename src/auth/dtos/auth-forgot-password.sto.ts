import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
