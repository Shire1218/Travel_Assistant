import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../modules/user/user.entity';
import { DemoItem } from '../modules/demo/demo.entity';

/**
 * TypeORM 数据源配置：供迁移 CLI 使用（pnpm migration:run 等）
 */
export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? 'root',
  database: process.env.DB_NAME ?? 'travel_system',
  charset: 'utf8mb4_unicode_ci',
  synchronize: false,
  logging: false,
  entities: [User, DemoItem],
  migrations: ['dist/database/migrations/*.js'],
});
