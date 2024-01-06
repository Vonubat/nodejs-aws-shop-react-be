import { Controller, Request, Response, All } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*/')
  async mainProxy(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ) {
    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);

    return this.appService.mainProxy(req, res);
  }
}
