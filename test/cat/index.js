import _ from 'lodash';
import { describe, it, after } from 'mocha';
import { expect, request } from 'chai';
import app from '../../src';
import { deleteRecords } from '../util/common';

describe('All /cat endpoints', () => {
  describe('/cat/register endpoint', () => {
    it('should return error response with empty name', async () => {
      const response = await request(app)
        .post('/cat/register')
        .set('content-type', 'application/json')
        .send({
          name: '',
          password: 'test1234',
          username: 'temp',
          weight: '5.4'
        });
      expect(response).to.have.status(400);
    });
    it('should return error response with empty password', async () => {
      const response = await request(app)
        .post('/cat/register')
        .set('content-type', 'application/json')
        .send({
          name: 'test',
          password: '',
          username: 'temp',
          weight: '5.4'
        });
      expect(response).to.have.status(400);
    });
    it('should return error response with empty username', async () => {
      const response = await request(app)
        .post('/cat/register')
        .set('content-type', 'application/json')
        .send({
          name: 'test',
          password: 'test1234',
          username: '',
          weight: '5.4'
        });
      expect(response).to.have.status(400);
    });
    it('should return error response with empty weight', async () => {
      const response = await request(app)
        .post('/cat/register')
        .set('content-type', 'application/json')
        .send({
          name: 'test',
          password: 'test1234',
          username: 'temp',
          weight: ''
        });
      expect(response).to.have.status(400);
    });
    it('should return error response with invalid password', async () => {
      const response = await request(app)
        .post('/cat/register')
        .set('content-type', 'application/json')
        .send({
          name: 'test',
          password: 'test12',
          username: 'temp',
          weight: '5.4'
        });
      expect(response).to.have.status(400);
    });
    it('should succeed with valid criteria', async () => {
      const response = await request(app)
        .post('/cat/register')
        .set('content-type', 'application/json')
        .send({
          name: 'test',
          password: 'test1234',
          username: 'temp',
          weight: '5.4'
        });
      expect(response).to.have.status(204);
    });
  });

  describe('/cat/login endpoint', () => {
    it('should return error response with invalid username', async () => {
      const response = await request(app)
        .post('/cat/login')
        .set('content-type', 'application/json')
        .send({
          username: 'garbage',
          password: 'test1234'
        });
      expect(response).to.have.status(403);
    });
    it('should return error response with invalid password', async () => {
      const response = await request(app)
        .post('/cat/login')
        .set('content-type', 'application/json')
        .send({
          username: 'temp',
          password: 'test12'
        });
      expect(response).to.have.status(403);
    });
    it('should succeed and send authToken with valid username and password', async () => {
      const response = await request(app)
        .post('/cat/login')
        .set('content-type', 'application/json')
        .send({
          username: 'temp',
          password: 'test1234'
        });
      expect(response).to.have.status(200);
      expect(_.isNil(response.body.authToken)).to.be.equal(false);
      expect(_.isEmpty(response.body.authToken)).to.be.equal(false);
    });
  });

  after(async () => {
    await deleteRecords();
  });
});
