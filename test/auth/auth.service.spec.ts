import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../src/services/user.service';
import { User } from '../../src/entities/user.entity'
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService:JwtService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('validateUser', () => {
    it('should validate user credentials and return user data without the password', async () => {
      const userWithPassword: User = { id: 1, username: 'testuser', password: 'hashedpassword', lentTransactions: [], borrowedTransactions: [] };
      jest.spyOn(userService, 'findUserWithPasswordByUsername').mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  
      const result = await service.validateUser('testuser', 'password');
  
      expect(userService.findUserWithPasswordByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(result).toEqual({ id: 1, username: 'testuser', lentTransactions: [], borrowedTransactions: [] });
    });
  
    it('should return null if password comparison fails', async () => {
      const userWithPassword: User = { id: 1, username: 'testuser', password: 'hashedpassword', lentTransactions: [], borrowedTransactions: [] };
      jest.spyOn(userService, 'findUserWithPasswordByUsername').mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  
      const result = await service.validateUser('testuser', 'wrongpassword');
  
      expect(result).toBeNull();
    });
  
    it('should return null if user is not found', async () => {
      jest.spyOn(userService, 'findUserWithPasswordByUsername').mockResolvedValue(null);
  
      const result = await service.validateUser('nonexistentuser', 'password');
  
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token for authenticated user', async () => {
      const user = { username: 'testuser', userId: 1 };
      const expectedToken = 'jwt.token.here';
      jest.spyOn(jwtService,'sign').mockReturnValue(expectedToken);
  
      const result = await service.login(user);
  
      expect(jwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.userId });
      expect(result).toEqual({ access_token: expectedToken });
    });
  });
  
  
});
