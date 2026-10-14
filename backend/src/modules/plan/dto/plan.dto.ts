import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/** 创建计划 DTO（SRS F2.2 计划元信息） */
export class CreatePlanDto {
  @IsString()
  @MinLength(1, { message: '标题不能为空' })
  @MaxLength(100)
  title: string;

  @IsDateString({}, { message: '出行开始日期格式不正确' })
  startDate: string;

  @IsDateString({}, { message: '出行结束日期格式不正确' })
  endDate: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: '同行人数至少 1 人' })
  companionCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @IsOptional()
  @MaxLength(1000)
  remark?: string;

  /** 总预算上限，使用字符串传输以保证精度，由校验器检查格式 */
  @IsOptional()
  @IsString()
  budgetTotal?: string;
}

/** 更新计划 DTO：全部字段可选 */
export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '标题不能为空' })
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsDateString({}, { message: '出行开始日期格式不正确' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: '出行结束日期格式不正确' })
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: '同行人数至少 1 人' })
  companionCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @IsOptional()
  @MaxLength(1000)
  remark?: string;

  @IsOptional()
  @IsString()
  budgetTotal?: string;
}
