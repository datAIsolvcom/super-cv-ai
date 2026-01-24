import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async syncUser(userDto: { email: string; name?: string; picture?: string }) {
    const { email, name, picture } = userDto;
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          picture,
          credits: 1,
          lastCreditRefresh: new Date(),
        },
      });
    }

    return user;
  }

  async register(body: { email: string; password: string; name: string }) {
    const { email, password, name } = body;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        credits: 1,
        lastCreditRefresh: new Date(),
      },
    });
    return user;
  }

  async validateUser(body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...result } = user;
    return result;
  }
}
