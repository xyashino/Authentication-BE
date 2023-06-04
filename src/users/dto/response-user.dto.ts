import { UserResponse } from '@/types';
import { Expose } from 'class-transformer';

export class ResponseUserDto implements UserResponse {
  @Expose()
  avatar: string | null;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  phone: string | null;
}