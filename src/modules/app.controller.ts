import { Public, SwaggerApiDocument } from 'src/common';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }
}
