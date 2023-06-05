export interface UserEntity {
  id: string;
  fullName: string;
  email: string;
  hashPwd: string | null;
  phone: string | null;
  avatar: string | null;
  currentTokenId: string | null;
  provider: 'google' | 'facebook' | 'jwt' | 'linkedin' | 'github';
}
