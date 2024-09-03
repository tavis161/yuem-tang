import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

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
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const user = new User();
    user.name = 'test';
    user.password = 'test';
    
    jest.spyOn(repository, 'save').mockResolvedValue(user);

    const result = await service.createUser('test', 'test');
    expect(result).toEqual(user);
  });
});
