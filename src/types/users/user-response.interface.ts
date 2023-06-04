import { LoginType } from '@/enums/login-type.enum';

export interface UserResponse {
  fullName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
}
