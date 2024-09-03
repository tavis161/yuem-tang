import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { LocalAuthGuard } from '../../src/auth/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
