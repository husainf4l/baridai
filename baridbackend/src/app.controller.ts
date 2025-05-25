import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('/')
  getApiInfo() {
    return {
      name: 'Barid.ai API',
      version: '1.0.0',
      status: 'active',
      documentation: '/api/docs',
      message: 'Welcome to the Barid.ai API'
    };
  }
}
