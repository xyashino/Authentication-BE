import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { configServiceMock } from '../../test/mocks/config-service.mock';
import { UserEntity } from '@/types';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;
  let userMock: CreateUserDto;
  let userMockWithId: CreateUserDto & { id: string };
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
            save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
            create: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            merge: jest.fn(),
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

    userMockWithId = { ...userMock, id };

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

      saveSpy = jest.spyOn(userRepo, 'save').mockResolvedValue(userMockWithId);
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
      expect(user).toEqual(userMockWithId);
    });

    it('should throw an error if email already exists and', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(userMockWithId);

      await expect(service.create(userMock)).rejects.toThrowError();
      expect(findOneSpy).toBeCalledWith({ email: userMock.email });
      expect(hashSpy).toBeCalledTimes(1);
      expect(userRepo.create).toBeCalledTimes(0);
      expect(userRepo.save).toBeCalledTimes(0);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [userMockWithId];
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
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(userMockWithId);
      expect(await service.findOne(id)).toEqual(userMockWithId);
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
        .mockResolvedValue(userMockWithId);
      const removeSpy = jest
        .spyOn(userRepo, 'remove')
        .mockImplementation(() => Promise.resolve(userMockWithId));

      expect(await service.remove(id)).toEqual(userMockWithId);
      expect(findOneSpy).toBeCalledWith({ id });
      expect(removeSpy).toBeCalledTimes(1);
      expect(findOneSpy).toBeCalledTimes(1);
    });
    it('should throw error if user is not found', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(undefined);
      await expect(service.remove(id)).rejects.toThrowError();
      expect(findOneSpy).toBeCalledWith({ id });
      expect(findOneSpy).toBeCalledTimes(1);
      expect(userRepo.remove).toBeCalledTimes(0);
    });
  });

  describe('update', () => {
    const newUserData = { name: 'new name', email: 'new email' };
    it('should update a user', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockImplementation(({ email }: UserEntity) => {
          if (email) return Promise.resolve(undefined);
          return Promise.resolve(userMockWithId);
        });

      const mergeSpy = jest
        .spyOn(userRepo, 'merge')
        .mockImplementation((user, updates: Partial<User>) => {
          Object.assign(user, updates);
          return user;
        });

      expect(await service.update(id, newUserData)).toEqual({
        ...userMockWithId,
        ...newUserData,
      });
      expect(mergeSpy).toBeCalledTimes(1);
      expect(mergeSpy).toBeCalledWith(userMockWithId, newUserData);
      expect(findOneSpy).toBeCalledWith({ id });
      expect(findOneSpy).toBeCalledWith({ email: newUserData.email });
      expect(findOneSpy).toBeCalledTimes(2);
    });
    it('should throw error if user is not found', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(undefined);
      await expect(service.update(id, newUserData)).rejects.toThrowError();

      expect(findOneSpy).toBeCalledWith({ id });
      expect(findOneSpy).toBeCalledTimes(1);
      expect(userRepo.save).toBeCalledTimes(0);
    });

    it('should throw error if email exist', async () => {
      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockImplementation(() => Promise.resolve(userMockWithId));

      await expect(service.update(id, newUserData)).rejects.toThrowError();

      expect(findOneSpy).toBeCalledWith({ id: userMockWithId.id });
      expect(findOneSpy).toBeCalledWith({ email: newUserData.email });
      expect(findOneSpy).toBeCalledTimes(2);
    });

    it('should change password', async () => {
      const newPassword = '11111111113123123213123';
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(newPassword));

      const findOneSpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockImplementation(() => Promise.resolve(userMockWithId));

      const mergeSpy = jest
        .spyOn(userRepo, 'merge')
        .mockImplementation((user, updates: Partial<User>) => {
          Object.assign(user, updates);
          return user;
        });

      await expect(
        service.update(id, { password: newPassword }),
      ).resolves.toEqual({
        ...userMockWithId,
        password: newPassword,
      });
      expect(hashSpy).toBeCalledWith(
        newPassword,
        +configService.get('BCRYPT_SALT'),
      );
      expect(hashSpy).toBeCalledTimes(2);
      expect(findOneSpy).toBeCalledWith({ id });
      expect(findOneSpy).toBeCalledTimes(1);
      expect(mergeSpy).toBeCalledTimes(1);
    });
  });
});
