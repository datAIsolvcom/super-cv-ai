import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncUserDto } from './dto/sync-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(dto: SyncUserDto) {
    const user = await this.prisma.user.upsert({
      where: { email: dto.email },
      update: {
        name: dto.name,
        picture: dto.picture,
        googleId: dto.googleId,
      },
      create: {
        email: dto.email,
        name: dto.name,
        picture: dto.picture,
        googleId: dto.googleId,
        credits: 3, 
      },
    });

    return user;
  }
}