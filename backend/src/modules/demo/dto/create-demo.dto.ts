import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDemoDto {
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;
}
