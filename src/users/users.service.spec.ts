import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { configServiceMock } from '../../test/mocks/config-service.mock';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User])],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(configServiceMock),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userMock = {
        password: 'test',
        email: 'test@wp.pl',
        avatar: 'urlTOavatart',
        name: 'John',
        phone: '123-123-132',
      } as CreateUserDto;

      const findOneBySpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockImplementation(() => Promise.resolve(undefined));
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(userMock.password));
      const saveSpy = jest.spyOn(userRepo, 'save');
      const user = await service.create(userMock);

      expect(findOneBySpy).toBeCalledWith({ email: userMock.email });
      expect(hashSpy).toBeCalledWith(userMock.password, 10);
      expect(saveSpy).toBeCalledWith(userMock);
      expect(user).toEqual(userMock);
    });
  });
});
