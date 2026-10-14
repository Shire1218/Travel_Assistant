import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoItem } from './demo.entity';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DemoItem])],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
