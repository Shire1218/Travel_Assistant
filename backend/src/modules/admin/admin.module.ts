import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SystemSetting } from './system-setting.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSetting]), UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
