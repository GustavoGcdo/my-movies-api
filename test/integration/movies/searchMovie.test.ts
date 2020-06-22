import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import DIContainer from '../../../src/di-container';
import { SignUpDto } from '../../../src/dtos/user/signUp.dto';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { ILoginHandler } from '../../../src/interfaces/auth/handlers/loginHandler.interface';
import { ISignupHandler } from '../../../src/interfaces/users/handlers/signupHandler.interface';
import AuthTypes from '../../../src/types/auth.types';
import UserTypes from '../../../src/types/user.types';

describe('Search Movie', () => {
  let application: Application;
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
    await signupHandler.handle(newUser);    
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
  })

  afterAll(async () => {    
    await mongoose.disconnect();
  });

  it('must bring an array of movies when searching for a valid term', async () => {
    await createValidUser();
    await loginInApplication();

    const validTerm = 'avengers';
    const response = await request(application)
      .get(`/movies?search=${validTerm}`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('movies found successfully');
    expect(response.body.success).toBeTruthy();
  });

  it('must return failure when trying to search without term', async () => {
    await createValidUser();
    await loginInApplication();

    const response = await request(application)
      .get(`/movies?search=`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('failed to fetch movies');
    expect(response.body.success).toBeFalsy();
    expect(response.body.errors).toContainEqual({
      name: 'search',
      message: 'search is required',
    });
  });
});
