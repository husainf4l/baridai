import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    // The user property is added by the JWT strategy's validate method
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }
}
