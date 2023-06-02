import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/types';
import { LoginType } from '@/enums/login-type.enum';

@Entity()
export class User implements UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    nullable: true,
    default: null,
  })
  hashPwd: string | null;

  @Column({
    nullable: true,
  })
  phone: string | null;

  @Column({
    nullable: true,
  })
  avatar: string | null;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @Column({
    type: 'enum',
    enum: LoginType,
    default: LoginType.Jwt,
  })
  provider: LoginType;
}
