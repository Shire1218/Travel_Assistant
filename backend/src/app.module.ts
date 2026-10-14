import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { PlanModule } from './modules/plan/plan.module';
import { DemoModule } from './modules/demo/demo.module';
import { User } from './modules/user/user.entity';
import { DemoItem } from './modules/demo/demo.entity';
import { Plan } from './modules/plan/plan.entity';
import { SystemSetting } from './modules/admin/system-setting.entity';

@Module({
  imports: [
    // 加载 .env 环境变量
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeORM 连接（与 data-source.ts 保持一致；实体变更后用迁移管理表结构）
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('DB_HOST') ?? '127.0.0.1',
        port: Number(configService.get<string>('DB_PORT') ?? 3306),
        username: configService.get<string>('DB_USER') ?? 'root',
        password: configService.get<string>('DB_PASS') ?? 'root',
        database: configService.get<string>('DB_NAME') ?? 'travel_system',
        charset: 'utf8mb4_unicode_ci',
        autoLoadEntities: true,
        synchronize: false, // 表结构统一由迁移管理
        entities: [User, DemoItem, Plan, SystemSetting],
      }),
    }),
    AuthModule,
    UserModule,
    AdminModule,
    PlanModule,
    DemoModule,
  ],
})
export class AppModule {}
