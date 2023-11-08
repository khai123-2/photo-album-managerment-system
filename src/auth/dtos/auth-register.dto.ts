import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
