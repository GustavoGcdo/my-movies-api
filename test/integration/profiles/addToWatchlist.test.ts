import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import { User } from '../../../src/models/entities/user';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { SignUpDto } from '../../../src/dtos/user/signUp.dto';
import DIContainer from '../../../src/di-container';
import { ISignupHandler } from '../../../src/interfaces/users/handlers/signupHandler.interface';
import UserTypes from '../../../src/types/user.types';
import { ILoginHandler } from '../../../src/interfaces/auth/handlers/loginHandler.interface';
import AuthTypes from '../../../src/types/auth.types';

describe('Add Movie to Watchlist', () => {
  let application: Application;
  let userToTest: User;
  let token: string;

  const newUser = {
    email: 'userToTestWathlist@email.com',
    password: 'pas123',
    confirmPassword: 'pas123',
    birthday: new Date('1997-04-18'),
    name: 'Gustavo',
  } as SignUpDto;

  async function createValidUser() {
    const signupHandler = DIContainer.get<ISignupHandler>(UserTypes.SignupHandler);
    const result = await signupHandler.handle(newUser);
    userToTest = result.data;
  }

  async function loginInApplication() {
    const credentials = {
      email: newUser.email,
      password: newUser.password,
    };

    const loginHandler = DIContainer.get<ILoginHandler>(AuthTypes.LoginHandler);
    const result = await loginHandler.handle(credentials);
    token = result.data.token;
  }

  beforeAll(async () => {
    application = await new App().create();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should be return success to add movie in profile', async () => {
    await createValidUser();
    await loginInApplication();

    const [profile] = userToTest.profiles;
    const validMovieId = 1771;
    const response = await request(application)
      .post(`/profiles/${profile._id}/watchlist`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        movieId: validMovieId,
      });

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('movie successfully added to watchlist');
    expect(response.body.success).toBeTruthy();
  });

  it('should be fail on pass movie id invalid', async () => {
    await createValidUser();
    await loginInApplication();

    const [profile] = userToTest.profiles;
    const invalidMovieId = 'invalidMovieId';
    const response = await request(application)
      .post(`/profiles/${profile._id}/watchlist`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        movieId: invalidMovieId,
      });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('fail to add movie in watchlist');
    expect(response.body.success).toBeFalsy();
  });

  it('should be fail on pass profile id invalid', async () => {
    await createValidUser();
    await loginInApplication();

    const invalidProfileId = 'invalidProfileId';
    const validMovieId = 1771;
    const response = await request(application)
      .post(`/profiles/${invalidProfileId}/watchlist`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        movieId: validMovieId,
      });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('fail to add movie in watchlist');
    expect(response.body.success).toBeFalsy();
  });
});
