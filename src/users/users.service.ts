import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async create({ email, password, ...restData }: CreateUserDto) {
    await this.checkEmail(email);
    const user = this.userRepository.create(restData);
    user.email = email;
    user.password = await this.hashPassword(password);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error('User not found');
    return user;
  }

  async update(id: string, { password, ...restUser }: UpdateUserDto) {
    const user = await this.findOne(id);
    if (restUser?.email) await this.checkEmail(restUser.email);
    this.userRepository.merge(user, restUser);
    if (password) user.password = await this.hashPassword(password);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  private async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new BadRequestException('Email already exists');
  }

  private async hashPassword(password: string) {
    return hash(password, +this.configService.get<number>('BCRYPT_SALT'));
  }
}
