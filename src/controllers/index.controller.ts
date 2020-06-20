import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { HandleResponse } from '../infra/handleResponse';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { Result } from '../infra/result';

@injectable()
export class IndexController {
  public getApiInfo(request: Request, response: Response) {
    const infoApi = {
      name: 'my-movies-api',
      version: '1.0',
    };

    const result = new Result(infoApi, 'success on get info API', true, []);
    return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
  }
}
