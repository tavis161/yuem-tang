// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UserService } from '../../src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user', async () => {
    const user = new User();
    user.name = 'test';
    user.password = await bcrypt.hash('test', 10);

    jest.spyOn(userService, 'findByUsername').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.validateUser('test', 'test');
    expect(result).toEqual({ name: 'test' });
  });

  it('should return null if validation fails', async () => {
    jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);

    const result = await service.validateUser('test', 'wrong');
    expect(result).toBeNull();
  });

  it('should login and return JWT token', async () => {
    const user = { id: 1, name: 'test' };
    jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

    const result = await service.login(user);
    expect(result).toEqual({ access_token: 'jwt-token' });
  });
});
