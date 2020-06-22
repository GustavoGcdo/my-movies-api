import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { User } from '../../../src/models/entities/user';
import { SignUpDto } from '../../../src/dtos/user/signUp.dto';
import DIContainer from '../../../src/di-container';
import { ISignupHandler } from '../../../src/interfaces/users/handlers/signupHandler.interface';
import UserTypes from '../../../src/types/user.types';
import { IAddToWatchlistHandler } from '../../../src/interfaces/profiles/handlers/addToWatchlistHandler.interface';
import ProfileTypes from '../../../src/types/profile.types';

describe('Get Recommended Movies', () => {
  let application: Application;
  let userToTest: User;

  async function createValidUser() {
    const newUser = {
      email: 'userToTest@email.com',
      password: 'pas123',
      confirmPassword: 'pas123',
      birthday: new Date('1997-04-18'),
      name: 'Gustavo',
    } as SignUpDto;

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
    await addMovieToWatchlist();

    const [profile] = userToTest.profiles;

    const response = await request(application).get(`/movies/recommended/${profile._id}`);
    
    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('recommended movies found successfully');
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it('must return a list of recommended movies when entering a profile without preferred genres', async () => {
    await createValidUser();

    const [profile] = userToTest.profiles;

    const response = await request(application).get(`/movies/recommended/${profile._id}`);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('recommended movies found successfully');
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });
});
