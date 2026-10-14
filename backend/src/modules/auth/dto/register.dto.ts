import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/** 注册 DTO（SRS F1.1：用户名 + 密码，昵称可选） */
export class RegisterDto {
  @IsString()
  @MinLength(2, { message: '用户名至少 2 个字符' })
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(6, { message: '密码至少 6 位' })
  @MaxLength(50)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;
}
