import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/types';

@Entity()
export class User implements UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  avatar: string;
}
