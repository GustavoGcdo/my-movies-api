import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import DIContainer from '../../../src/di-container';
import { SignUpDto } from '../../../src/dtos/user/signUp.dto';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { ILoginHandler } from '../../../src/interfaces/auth/handlers/loginHandler.interface';
import { IGetWatchlistHandler } from '../../../src/interfaces/profiles/handlers/getWatchlistHandler.interface';
import { ISignupHandler } from '../../../src/interfaces/users/handlers/signupHandler.interface';
import { MyMovie } from '../../../src/models/entities/myMovie';
import { User } from '../../../src/models/entities/user';
import AuthTypes from '../../../src/types/auth.types';
import ProfileTypes from '../../../src/types/profile.types';
import UserTypes from '../../../src/types/user.types';
import { IAddToWatchlistHandler } from './../../../src/interfaces/profiles/handlers/addToWatchlistHandler.interface';

describe('Mark as Watched', () => {
  let application: Application;
  let userToTest: User;
  let watchListToTest: MyMovie[];
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

  async function addMovieToWatchlist() {
    const [profile] = userToTest.profiles;
    const validMovieId = 1771;

    const addToWatchlistHandler = DIContainer.get<IAddToWatchlistHandler>(
      ProfileTypes.AddToWatchlistHandler,
    );
    if (profile._id) {
      await addToWatchlistHandler.handle({
        profileId: profile._id,
        movieId: validMovieId,
      });
    }
  }

  async function getWatchlist() {
    const [profile] = userToTest.profiles;

    const getWatchlistHandler = DIContainer.get<IGetWatchlistHandler>(
      ProfileTypes.GetWatchlistHandler,
    );
    if (profile._id) {
      const result = await getWatchlistHandler.handle({ profileId: profile._id });
      watchListToTest = result.data;
    }
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
    await mongoose.disconnect();
  });

  it('must return success when marking a movie as watched', async () => {
    await createValidUser();
    await loginInApplication();
    await addMovieToWatchlist();
    await getWatchlist();

    const [profile] = userToTest.profiles;
    const [myMovie] = watchListToTest;

    const response = await request(application)
      .post(`/profiles/${profile._id}/watchlist/${myMovie._id}/watched`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('movie marked as watched successfully');
    expect(response.body.success).toBeTruthy();
  });
});
