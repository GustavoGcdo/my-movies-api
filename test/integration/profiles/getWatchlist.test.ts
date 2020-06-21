import { Application } from 'express';
import { User } from '../../../src/models/entities/user';
import { App } from '../../../src/app';
import request from 'supertest';
import mongoose from 'mongoose';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';

describe('Get Watchlist', () => {
  let application: Application;
  let userToTest: User;

  beforeAll(async () => {
    application = await new App().create();

    const newUser = {
      email: 'userToTestWathlist@email.com',
      password: 'pas123',
      confirmPassword: 'pas123',
      birthday: '1997-04-18',
      name: 'Gustavo',
    };

    const response = await request(application).post('/users/signup').send(newUser);
    userToTest = response.body.data;

    const [profile] = userToTest.profiles;
    const validMovieId = 1771;
    await request(application).post(`/profiles/${profile._id}/watchlist`).send({
      movieId: validMovieId,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('must return a list of films when entering a valid profile', async () => {
    const [profile] = userToTest.profiles;

    const response = await request(application).get(`/profiles/${profile._id}/watchlist`);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('watchlist successfully found');
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });
});
