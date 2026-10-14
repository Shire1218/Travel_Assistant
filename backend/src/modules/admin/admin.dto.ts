import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** 管理员创建用户 DTO */
export class AdminCreateUserDto {
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

  @IsOptional()
  @IsIn(['user', 'admin'], { message: '角色不合法' })
  role?: 'admin' | 'user';
}

/** 管理员编辑用户 DTO：昵称 / 角色 / 状态 */
export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @IsOptional()
  @IsIn(['user', 'admin'], { message: '角色不合法' })
  role?: 'admin' | 'user';

  @IsOptional()
  @IsInt()
  @IsIn([0, 1], { message: '状态不合法' })
  status?: number;
}

/** 管理员重置密码 DTO */
export class AdminResetPasswordDto {
  @IsString()
  @MinLength(6, { message: '密码至少 6 位' })
  @MaxLength(50)
  password: string;
}

/** 系统设置 DTO（高德两个 key） */
export class AdminUpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  amapJsKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  amapWebServiceKey?: string;
}
