import { Application } from 'express';
import { App } from '../../../src/app';
import request from 'supertest';
import mongoose from 'mongoose';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { SignUpDto } from '../../../src/dtos/user/signUp.dto';
import { ISignupHandler } from '../../../src/interfaces/users/handlers/signupHandler.interface';
import DIContainer from '../../../src/di-container';
import UserTypes from '../../../src/types/user.types';
import { User } from '../../../src/models/entities/user';

describe('Login', () => {
  let application: Application;
  let userToTest: SignUpDto;

  async function createValidUser() {
    const newUser = {
      email: 'userToTestWathlist@email.com',
      password: 'pas123',
      confirmPassword: 'pas123',
      birthday: new Date('1997-04-18'),
      name: 'Gustavo',
    } as SignUpDto;

    const signupHandler = DIContainer.get<ISignupHandler>(UserTypes.SignupHandler);
    await signupHandler.handle(newUser);
    userToTest = newUser;
  }

  beforeAll(async () => {
    application = await new App().create();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('must return success when logging in with valid credentials', async () => {
    await createValidUser();

    const validCredentials = {
      email: userToTest.email,
      password: userToTest.password,
    };

    const response = await request(application).post(`/auth/login`).send(validCredentials);
    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('login successfully');
    expect(response.body.success).toBeTruthy();
    expect(response.body.data).toHaveProperty('token');
  });

  it('must fail to pass incorrect credentials', async () => {
    
    const invalidCredentials = {
      email: 'invalidEmail@email.com',
      password: 'invalidPass',
    };

    const response = await request(application).post(`/auth/login`).send(invalidCredentials);
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('fail to login');
    expect(response.body.success).toBeFalsy();
    expect(response.body.errors).toContainEqual({
        name: 'auth',
        message: 'user or password not match',
      });    
  });
});
