import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { User } from '../../../src/models/entities/user';

describe('List Profiles User', () => {
  let application: Application;
  let userToTest: User;

  beforeAll(async () => {
    application = await new App().create();

    const newUser = {
      email: 'userToTestProfiles@email.com',
      password: 'pas123',
      confirmPassword: 'pas123',
      birthday: '1997-04-18',
      name: 'Gustavo',
    };

    const response = await request(application).post('/users/signup').send(newUser);
    userToTest = response.body.data;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('must return the profiles successfully when informing a valid user', async () => {
    const response = await request(application).get(`/users/${userToTest._id}/profiles`);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('profiles successfully listed');
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it('must return failure to send an invalid user', async () => {
    const invalidUserId = 'invalidUserId';
    const response = await request(application).get(`/users/${invalidUserId}/profiles`);

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('could not bring up profile list');
    expect(response.body.success).toBeFalsy();
    expect(response.body.errors).toContainEqual({
      name: 'id',
      message: 'invalid id',
    });
  });
});
