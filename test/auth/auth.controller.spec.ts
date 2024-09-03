import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { UserService } from '../../src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/entities/user.entity'

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let jwtService:JwtService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('login', () => {
    it('should return the result from AuthService.login', async () => {
      const req = { user: { username: 'testuser', userId: 1 } };
      const expectedToken = { access_token: 'token' };
      jest.spyOn(authService, 'login').mockResolvedValue(expectedToken);
  
      const result = await authController.login(req);
  
      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(expectedToken);
    });
  });
  
  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const req = { user: { username: 'testuser', userId: 1 } };
  
      const result = authController.getProfile(req);
  
      expect(result).toEqual(req.user);
    });
  });
  
});
