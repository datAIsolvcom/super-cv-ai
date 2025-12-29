import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyncUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  @IsOptional()
  googleId?: string;
}