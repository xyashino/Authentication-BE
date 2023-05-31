import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
