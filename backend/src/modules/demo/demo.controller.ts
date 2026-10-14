import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DemoService } from './demo.service';
import { CreateDemoDto } from './dto/create-demo.dto';

/** 示例 CRUD 接口：需登录后访问 */
@Controller('demo')
@UseGuards(AuthGuard('jwt'))
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  findAll() {
    return this.demoService.findAll();
  }

  @Post()
  create(@Body() dto: CreateDemoDto) {
    return this.demoService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateDemoDto) {
    return this.demoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.demoService.remove(id);
  }
}
