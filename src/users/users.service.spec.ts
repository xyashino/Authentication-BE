import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { configServiceMock } from '../../test/mocks/config-service.mock';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;
  let userMock: CreateUserDto;
  let configService: ConfigService;
  const id = '123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(configServiceMock),
          },
        },
      ],
    }).compile();

    userMock = {
      password: 'test',
      email: 'test@wp.pl',
      avatar: 'urlTOavatart',
      name: 'John',
      phone: '123-123-132',
    };

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let hashSpy: jest.SpyInstance;
    let saveSpy: jest.SpyInstance;

    beforeEach(() => {
      const { email, phone, ...rest } = userMock;
      userRepo.create = jest.fn().mockReturnValue(rest);

      hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(userMock.password));

      saveSpy = jest
        .spyOn(userRepo, 'save')
        .mockResolvedValue({ id, ...userMock });
    });

    it('should create a user', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(undefined);

      const user = await service.create(userMock);

      expect(findOneSpy).toBeCalledWith({ email: userMock.email });
      expect(hashSpy).toBeCalledWith(
        userMock.password,
        +configService.get('BCRYPT_SALT'),
      );
      expect(userRepo.create).toBeCalledTimes(1);
      expect(saveSpy).toBeCalledTimes(1);
      expect(user).toEqual({ id, ...userMock });
    });

    it('should throw an error if email already exists and', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue({ id, ...userMock });

      await expect(service.create(userMock)).rejects.toThrowError();
      expect(findOneSpy).toBeCalledWith({ email: userMock.email });
      expect(hashSpy).toBeCalledTimes(1);
      expect(userRepo.create).toBeCalledTimes(0);
      expect(userRepo.save).toBeCalledTimes(0);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id, ...userMock }];
      const findSpy = jest.spyOn(userRepo, 'find').mockResolvedValue(users);
      expect(await service.findAll()).toEqual(users);
      expect(findSpy).toBeCalledTimes(1);
    });
    it('should return empty array if no users', async () => {
      const findSpy = jest.spyOn(userRepo, 'find').mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
      expect(findSpy).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id, ...userMock };
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(user);
      expect(await service.findOne(id)).toEqual(user);
      expect(findOneSpy).toBeCalledWith({ id });
    });
    it('should throw error if user is not found', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(undefined);
      await expect(service.findOne(id)).rejects.toThrowError();
      expect(findOneSpy).toBeCalledWith({ id });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue({ id, ...userMock });
      const removeSpy = jest.spyOn(userRepo, 'remove').mockResolvedValue({
        id,
        ...userMock,
      });

      expect(await service.remove(id)).toEqual({ id, ...userMock });
      expect(findOneSpy).toBeCalledWith({ id });
      expect(removeSpy).toBeCalledTimes(1);
      expect(service.findOne).toBeCalledTimes(1);
      expect(service.findOne).toBeCalledWith({ id });
    });
    it('should throw error if user is not found', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(undefined);
      await expect(service.remove(id)).rejects.toThrowError();
      expect(findOneSpy).toBeCalledWith({ id });
      expect(service.findOne).toBeCalledTimes(1);
      expect(service.findOne).toBeCalledWith({ id });
      expect(userRepo.remove).toBeCalledTimes(0);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue({ id, ...userMock });
      const saveSpy = jest.spyOn(userRepo, 'save').mockResolvedValue({
        id,
        ...userMock,
      });

      expect(
        await service.update(id, { name: 'new name', email: 'new email' }),
      ).toEqual({
        id,
        ...userMock,
        ...{ name: 'new name', email: 'new email' },
      });
      expect(findOneSpy).toBeCalledWith({ id });
      expect(saveSpy).toBeCalledTimes(1);
      expect(service.findOne).toBeCalledTimes(1);
      expect(service.findOne).toBeCalledWith({ id });
    });
    it('should throw error if user is not found', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(undefined);
      await expect(
        service.update(id, { name: 'new name', email: 'new email' }),
      ).rejects.toThrowError();
      expect(findOneSpy).toBeCalledWith({ id });
      expect(service.findOne).toBeCalledTimes(1);
      expect(service.findOne).toBeCalledWith({ id });
      expect(userRepo.save).toBeCalledTimes(0);
    });
  });
});
