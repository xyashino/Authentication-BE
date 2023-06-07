import { LoginType } from '@/enums/login-type.enum';

export interface UserEntity {
  id: string;
  fullName: string;
  email: string;
  hashPwd: string | null;
  phone: string | null;
  avatar: string | null;
  currentTokenId: string | null;
  bio: string | null;
  provider: LoginType;
}
