import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../../../src/app';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';
import { User } from '../../../src/models/entities/user';

describe.only('Add Profile to User', () => {
  let application: Application;
  let userToTest: User;

  beforeAll(async () => {
    application = await new App().create();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();

    const newUser = {
      email: 'userToTest@email.com',
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

  it('should be success to add profile a user', async () => {
    const newProfile = { name: 'Familia' };

    const response = await request(application)
      .post(`/users/${userToTest._id}/profiles`)
      .send(newProfile);

    expect(response.status).toEqual(HttpStatus.SUCCESS);
    expect(response.body.message).toEqual('profile added with success');
    expect(response.body.success).toBeTruthy();
  });

  it('should be fail to add profile without name a user', async () => {
    const newProfile = {};

    const response = await request(application)
      .post(`/users/${userToTest._id}/profiles`)
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
    const newProfile = { name: 'FakeProfile' };
    const invalidID = 'invalidID';

    const response = await request(application)
      .post(`/users/${invalidID}/profiles`)
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
    const newProfile = { name: 'PerfilTeste' };

    await request(application).post(`/users/${userToTest._id}/profiles`).send(newProfile);
    await request(application).post(`/users/${userToTest._id}/profiles`).send(newProfile);
    await request(application).post(`/users/${userToTest._id}/profiles`).send(newProfile);
    const response = await request(application)
      .post(`/users/${userToTest._id}/profiles`)
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
