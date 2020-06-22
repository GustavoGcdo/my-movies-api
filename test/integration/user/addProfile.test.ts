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
import { ILoginHandler } from '../../../src/interfaces/auth/handlers/loginHandler.interface';
import AuthTypes from '../../../src/types/auth.types';

describe('Add Profile to User', () => {
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

  it('should be success to add profile a user', async () => {
    await createValidUser();
    await loginInApplication();

    const newProfile = { name: 'Familia' };

    const response = await request(application)
      .post(`/users/${userToTest._id}/profiles`)
      .set('Authorization', 'Bearer ' + token)
      .send(newProfile);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('profile added with success');
    expect(response.body.success).toBeTruthy();
  });

  it('should be fail to add profile without name a user', async () => {
    await createValidUser();
    await loginInApplication();

    const newProfile = {};

    const response = await request(application)
      .post(`/users/${userToTest._id}/profiles`)
      .set('Authorization', 'Bearer ' + token)
      .send(newProfile);

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('fail to add profile to user');
    expect(response.body.success).toBeFalsy();
    expect(response.body.errors).toContainEqual({
      name: 'name',
      message: 'name is required',
    });
  });

  it('should be fail to add profile with invalid user id', async () => {
    await createValidUser();
    await loginInApplication();

    const newProfile = { name: 'FakeProfile' };
    const invalidID = 'invalidID';

    const response = await request(application)
      .post(`/users/${invalidID}/profiles`)
      .set('Authorization', 'Bearer ' + token)
      .send(newProfile);

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('fail to add profile to user');
    expect(response.body.success).toBeFalsy();
    expect(response.body.errors).toContainEqual({
      name: 'id',
      message: 'invalid id',
    });
  });

  it('should be fail to try add more than 4 profiles', async () => {
    await createValidUser();
    await loginInApplication();

    const newProfile = { name: 'PerfilTeste' };

    for (let i = 0; i < 3; i++) {
      await request(application)
        .post(`/users/${userToTest._id}/profiles`)
        .set('Authorization', 'Bearer ' + token)
        .send(newProfile);
    }

    const response = await request(application)
      .post(`/users/${userToTest._id}/profiles`)
      .set('Authorization', 'Bearer ' + token)
      .send(newProfile);

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('fail to add profile to user');
    expect(response.body.success).toBeFalsy();
    expect(response.body.errors).toContainEqual({
      name: 'profiles',
      message: 'max number profiles already registered',
    });
  });
});
