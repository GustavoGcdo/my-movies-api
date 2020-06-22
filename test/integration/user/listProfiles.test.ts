import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { User } from '../../../src/models/entities/user';
import DIContainer from '../../../src/di-container';
import { ISignupHandler } from '../../../src/interfaces/users/handlers/signupHandler.interface';
import UserTypes from '../../../src/types/user.types';
import { ILoginHandler } from '../../../src/interfaces/auth/handlers/loginHandler.interface';
import AuthTypes from '../../../src/types/auth.types';
import { SignUpDto } from '../../../src/dtos/user/signUp.dto';

describe('List Profiles User', () => {
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

  it('must return the profiles successfully when informing a valid user', async () => {
    await createValidUser();
    await loginInApplication();

    const response = await request(application)
      .get(`/users/${userToTest._id}/profiles`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('profiles successfully listed');
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it('must return failure to send an invalid user', async () => {
    const invalidUserId = 'invalidUserId';
    
    const response = await request(application)
      .get(`/users/${invalidUserId}/profiles`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('could not bring up profile list');
    expect(response.body.success).toBeFalsy();
    expect(response.body.errors).toContainEqual({
      name: 'id',
      message: 'invalid id',
    });
  });
});
