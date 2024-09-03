import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const userWithPassword = await this.userService.findUserWithPasswordByUsername(username);
    if (userWithPassword && await bcrypt.compare(password, userWithPassword.password)) {
      const { password, ...userWithoutPassword } = userWithPassword;
      return userWithoutPassword;
    }
    return null; 
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
