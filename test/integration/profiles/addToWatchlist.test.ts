import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import { User } from '../../../src/models/entities/user';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';

describe('List Profiles User', () => {
  let application: Application;
  let userToTest: User;

  beforeAll(async () => {
    application = await new App().create();

    const newUser = {
      email: 'userToTestWatchlist@email.com',
      password: 'pas123',
      confirmPassword: 'pas123',
      birthday: '1997-04-18',
      name: 'Gustavo',
    };

    const response = await request(application).post('/users/signup').send(newUser);
    userToTest = response.body.data;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be return success to add movie in profile', async () => {
    const [profile] = userToTest.profiles;
    const validMovieId = 1771;
    const response = await request(application).post(`/profiles/${profile._id}/watchlist`).send({
      movieId: validMovieId,
    });

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('movie successfully added to watchlist');
    expect(response.body.success).toBeTruthy();
  });

  it('should be fail on pass movie id invalid', async () => {
    const [profile] = userToTest.profiles;
    const invalidMovieId = 'invalidMovieId';
    const response = await request(application).post(`/profiles/${profile._id}/watchlist`).send({
      movieId: invalidMovieId,
    });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('fail to add movie in watchlist');
    expect(response.body.success).toBeFalsy();
  });

  it('should be fail on pass profile id invalid', async () => {
    const invalidProfileId = 'invalidProfileId';
    const validMovieId = 1771;
    const response = await request(application)
      .post(`/profiles/${invalidProfileId}/watchlist`)
      .send({
        movieId: validMovieId,
      });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('fail to add movie in watchlist');
    expect(response.body.success).toBeFalsy();
  });
});
