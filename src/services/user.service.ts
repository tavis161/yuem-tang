import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  private toUserDto(user: User): UserDto {
    const { id, username } = user;
    return { id, username };
  }

  async findUserWithPasswordByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
        where: { username },
        select: ['id', 'username', 'password']
    });
}

  async createUser(username: string, password: string): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashedPassword });
    const savedUser = await this.userRepository.save(user);
    return this.toUserDto(savedUser);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });
    return user ? this.toUserDto(user) : null;
  }
}
