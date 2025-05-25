import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
      registerDto.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate-token')
  validateTokenGet(@Request() req) {
    return {
      isValid: true,
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-token')
  validateTokenPost(@Request() req) {
    return {
      isValid: true,
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  validateTokenPosts(@Request() req) {
    return {
      isValid: true,
      user: req.user,
    };
  }

  @Post('validate-token-manual')
  async validateTokenManually(@Body() { token }: { token: string }) {
    return this.authService.validateToken(token);
  }
}
