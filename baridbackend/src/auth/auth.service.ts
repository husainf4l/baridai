import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log(`Attempting to validate user: ${username}`);
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log(`User ${username} not found`);
      return null;
    }

    console.log(`User found, comparing passwords`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}`);

    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    console.log('user', user);
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(username: string, password: string, email?: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: email || '' }],
      },
    });

    if (existingUser) {
      throw new UnauthorizedException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    const { password: _, ...result } = newUser;
    return result;
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      if (!user) {
        return { isValid: false };
      }

      return {
        isValid: true,
        user,
      };
    } catch (error) {
      return { isValid: false };
    }
  }
}
