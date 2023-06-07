import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';

const AllowedMimeTypes = [
  'image/jpeg',
  'image/gif',
  'image/jpg',
  'image/png',
  'image/webp',
];

@Injectable()
export class UploadService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async createFile(avatarDir: string, fileName: string, buffer: Buffer) {
    const uploadDir = this.configService.get('UPLOAD_DIR').replace(/\/$/, '');
    try {
      await mkdir(`${uploadDir}/${avatarDir}`, { recursive: true });
      await writeFile(`${uploadDir}/${avatarDir}/${fileName}`, buffer);
    } catch (error) {
      throw new ConflictException(
        `Failed to avatar the file: ${error.message}`,
      );
    }

    const publicHost = this.configService
      .get('PUBLIC_HOST_URL')
      .replace(/\/$/, '');

    return `${publicHost}/${avatarDir}/${fileName}`;
  }

  async uploadAvatar(
    { originalname, buffer, mimetype }: Express.Multer.File,
    id: string,
  ) {
    if (!AllowedMimeTypes.includes(mimetype)) {
      throw new ConflictException(`File type ${mimetype} not allowed`);
    }

    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) throw new NotFoundException('Invalid user id');
    foundUser.avatar = await this.createFile(`${id}`, originalname, buffer);
    return this.userRepository.save(foundUser);
  }
}
