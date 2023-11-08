import { IsNotEmpty, IsString } from 'class-validator';

export class AuthEmailLoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
