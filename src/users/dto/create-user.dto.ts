import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserCreate } from '@/types/users/user-create.interface';

export class CreateUserDto implements UserCreate {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 255)
  password: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;
}
