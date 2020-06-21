import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';

describe.only('Search Movie', () => {
  let application: Application;

  beforeAll(async () => {
    application = await new App().create();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('must bring an array of movies when searching for a valid term', async () => {
    const validTerm = 'avengers';
    const response = await request(application).get(`/movies?search=${validTerm}`);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('movies found successfully');
    expect(response.body.success).toBeTruthy();
  });

  it('must return failure when trying to search without term', async () => {
    
    const response = await request(application).get(`/movies?search=`);

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('failed to fetch movies');
    expect(response.body.success).toBeFalsy();
    expect(response.body.errors).toContainEqual({
        name: 'search',
        message: 'search is required',
      });
  });
});
