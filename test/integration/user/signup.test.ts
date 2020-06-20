import { Application } from 'express';
import { App } from '../../../src/app';
import request from 'supertest';
import mongoose from 'mongoose';
import { HttpStatus } from '../../../src/infra/enums/http-status.enum';

describe('Signup', () => {
  let application: Application;

  beforeAll(async () => {
    application = await new App().create();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be success when pass valid new credentials', async () => {
    const newUser = {
      email: 'email@email.com',
      password: 'pas123',
      confirmPassword: 'pas123',
      birthday: '1997-04-18',
      name: 'Gustavo',
    };

    const response = await request(application).post('/users/signup').send(newUser);
    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('email');
  });

  it('should be fail to pass email already registered', async () => {
    const newUser = {
      email: 'user1@email.com',
      password: 'pass123',
      confirmPassword: 'pass123',
      birthday: '1997-04-18',
      name: 'Gustavo',
    };

    const firstResponse = await request(application).post('/users/signup').send(newUser);
    expect(firstResponse.status).toEqual(HttpStatus.CREATED);

    const secondResponse = await request(application).post('/users/signup').send(newUser);
    expect(secondResponse.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(secondResponse.body.errors).toContainEqual({
      name: 'email',
      message: 'email already registered',
    });
  });

  it('should be fail to not pass email', async () => {
    const newUser = {};

    const response = await request(application).post('/users/signup').send(newUser);
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toContainEqual({ name: 'email', message: 'email is required' });
  });

  it('should be fail to not pass password', async () => {
    const newUser = { email: 'any@email.com' };

    const response = await request(application).post('/users/signup').send(newUser);
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toContainEqual({
      name: 'password',
      message: 'password is required',
    });
  });

  it('should be fail to pass password less 6 characters', async () => {
    const newUser = { email: 'any@email.com', password: '12345' };

    const response = await request(application).post('/users/signup').send(newUser);
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toContainEqual({
      name: 'password',
      message: 'password must be at least 6 characters',
    });
  });

  it('should be fail to not pass password and confirmPassord valid', async () => {
    const newUser = {
      email: 'any@email.com',
      password: 'pass123',
      confirmPassword: 'anyPass',
    };

    const response = await request(application).post('/users/signup').send(newUser);
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toContainEqual({
      name: 'confirmPassword',
      message: 'confirm password not match with password',
    });
  });

  it('should be fail to pass invalid email', async () => {
    const newUser = {
      email: 'emailInvalid',
      password: 'anyPass',
      confirmPassword: 'anyPass',
    };

    const response = await request(application).post('/users/signup').send(newUser);
    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toContainEqual({
      name: 'email',
      message: 'invalid email',
    });
  });
});
