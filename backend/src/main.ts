import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局路由前缀 /api
  app.setGlobalPrefix('api');
  // 允许前端开发服务器跨域
  app.enableCors();
  // DTO 校验管道
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  // 统一响应结构 + 统一异常处理
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`后端已启动: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
