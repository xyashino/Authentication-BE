import { UserEntity } from '@types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto implements Partial<UserEntity> {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 255)
  password: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
