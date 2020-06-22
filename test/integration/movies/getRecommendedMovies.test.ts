import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import DIContainer from '../../../src/di-container';
import { SignUpDto } from '../../../src/dtos/user/signUp.dto';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { ILoginHandler } from '../../../src/interfaces/auth/handlers/loginHandler.interface';
import { IAddToWatchlistHandler } from '../../../src/interfaces/profiles/handlers/addToWatchlistHandler.interface';
import { ISignupHandler } from '../../../src/interfaces/users/handlers/signupHandler.interface';
import { User } from '../../../src/models/entities/user';
import AuthTypes from '../../../src/types/auth.types';
import ProfileTypes from '../../../src/types/profile.types';
import UserTypes from '../../../src/types/user.types';

describe('Get Recommended Movies', () => {
  let application: Application;
  let userToTest: User;
  let token: string;

  const newUser = {
    email: 'userToTest@email.com',
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

  it('must return a list of recommended movies when entering a profile with preferred genres', async () => {
    await createValidUser();
    await loginInApplication();
    await addMovieToWatchlist();

    const [profile] = userToTest.profiles;

    const response = await request(application)
      .get(`/movies/recommended/${profile._id}`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('recommended movies found successfully');
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it('must return a list of recommended movies when entering a profile without preferred genres', async () => {
    await createValidUser();
    await loginInApplication();    

    const [profile] = userToTest.profiles;

    const response = await request(application)
      .get(`/movies/recommended/${profile._id}`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('recommended movies found successfully');
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });
});
