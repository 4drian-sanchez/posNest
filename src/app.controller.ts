import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  getPost() {
    return this.appService.getPost();
  }


  @Put()
  put() {
    return 'desde put'
  }

  @Delete()
  delete() {
    return 'desde delete'
  }
}
