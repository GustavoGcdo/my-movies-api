import request from 'supertest';
import { App } from '../../../src/app';
import { Application } from 'express';
import mongoose from 'mongoose';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';

describe('Index Controller', () => {
  let application: Application;

  beforeAll(async () => {
    application = await new App().create();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('GET - shold be return info api', async () => {
    const expectedResult = {
      name: 'my-movies-api',
      version: '1.0',
    };

    const result = await request(application).get('/');
    expect(result.status).toEqual(HttpStatus.SUCCESS);
    expect(result.body.data).toEqual(expectedResult);
  });
});
