import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user.service';
import { UserDto } from '../../src/dtos/user.dto';
import { User } from '../../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [ 
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user and return a UserDto', async () => {
      const createUserDto = { username: 'testuser', password: 'testpassword' };
      const userDto: UserDto = { id: 1, username: 'testuser' };
  
      jest.spyOn(userService, 'createUser').mockResolvedValue(userDto);
  
      const result = await userController.create(createUserDto);
  
      expect(userService.createUser).toHaveBeenCalledWith('testuser', 'testpassword');
      expect(result).toEqual(userDto);
    });
  });
  
  describe('findOne', () => {
    it('should return a UserDto for the given id', async () => {
      const userDto: UserDto = { id: 1, username: 'testuser' };
  
      jest.spyOn(userService, 'findOne').mockResolvedValue(userDto);
  
      const result = await userController.findOne(1);
  
      expect(userService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(userDto);
    });
  
    it('should return empty if no user is found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(new User());
  
      const result = await userController.findOne(999);
  
      expect(userService.findOne).toHaveBeenCalledWith(999);
      expect(result).toEqual(new User());
    });
  });
  
});
