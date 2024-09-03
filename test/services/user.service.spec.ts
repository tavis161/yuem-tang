import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findUserWithPasswordByUsername', () => {
    it('should return a user including the password', async () => {
      const username = 'testuser';
      const expectedResult: User = { id: 1, username: 'testuser', password: 'hashedpassword', lentTransactions: [], borrowedTransactions: [] };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(expectedResult);
  
      const result = await service.findUserWithPasswordByUsername(username);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
        select: ['id', 'username', 'password']
      });
      expect(result).toEqual(expectedResult);
    });
  
    it('should return null if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
  
      const result = await service.findUserWithPasswordByUsername('nonexistent');
      expect(result).toBeNull();
    });
  });
  
  describe('createUser', () => {
    it('should create a new user and return a user DTO', async () => {
      const username = 'newuser';
      const password = 'password123';
      const hashedPassword = '$2b$10$3Y85D5eIykhoJQ/TWwDYh.nS5M1hvh34rBzygo060rJv7SGN/cmgW';
      const user: User = { id: 1, username: 'newuser', password: 'hashedpassword', lentTransactions: [], borrowedTransactions: [] };
  
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
  
      const result = await service.createUser(username, password);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual({ id: 1, username });
    });
  });

  
  describe('findOne', () => {
    it('should return a user DTO if user exists', async () => {
      const user: User = { id: 1, username: 'existingUser', password: 'hashedpassword', lentTransactions: [], borrowedTransactions: []  };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
  
      const result = await service.findOne(1);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ id: 1, username: 'existingUser' });
    });
  
    it('should return null if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
  
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });
  
});
