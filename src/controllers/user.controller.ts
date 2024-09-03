import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: { username: string, password: string }): Promise<UserDto> {
    return this.userService.createUser(createUserDto.username, createUserDto.password);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findOne(id);
  }
}
