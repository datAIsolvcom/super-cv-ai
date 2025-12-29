import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SyncUserDto } from './dto/sync-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  async syncUser(@Body() syncUserDto: SyncUserDto) {
    return this.authService.syncUser(syncUserDto);
  }
}