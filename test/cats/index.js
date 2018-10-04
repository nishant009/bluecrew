import { describe, it, before, after } from 'mocha';
import { expect, request } from 'chai';
import app from '../../src';
import { createRecords, deleteRecords } from '../util/common';

describe('All /cats endpoints', () => {
  before(async () => {
    await createRecords(40);
  });

  describe('/cats endpoint', () => {
    let token = '';
    before(async () => {
      const loginResponse = await request(app)
        .post('/cat/login')
        .set('content-type', 'application/json')
        .send({ username: 'test1', password: 'password1' });
      token = loginResponse.body.authToken;
    });

    it('should return response with valid token and no criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token);
      expect(response).to.have.status(200);
      expect(response.body[0].name).to.be.equal('temp1');
    });
    it('should return response with valid token and id criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token)
        .set('content-type', 'application/json')
        .send({ id: '1' });
      expect(response).to.have.status(200);
      expect(response.body[0].name).to.be.equal('temp1');
    });
    it('should return response with valid token and name criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token)
        .set('content-type', 'application/json')
        .send({ name: 'temp1' });
      expect(response).to.have.status(200);
      expect(response.body[0].name).to.be.equal('temp1');
    });
    it('should return response with valid token and username criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token)
        .set('content-type', 'application/json')
        .send({ username: 'test1' });
      expect(response).to.have.status(200);
      expect(response.body[0].name).to.be.equal('temp1');
    });
    it('should return response with valid token and id, name criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token)
        .set('content-type', 'application/json')
        .send({ id: '1', name: 'temp1' });
      expect(response).to.have.status(200);
      expect(response.body[0].name).to.be.equal('temp1');
    });
    it('should return response with valid token and id, username criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token)
        .set('content-type', 'application/json')
        .send({ id: '1', username: 'test1' });
      expect(response).to.have.status(200);
      expect(response.body[0].name).to.be.equal('temp1');
    });
    it('should return response with valid token and name, username criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token)
        .set('content-type', 'application/json')
        .send({ name: 'temp1', username: 'test1' });
      expect(response).to.have.status(200);
      expect(response.body[0].name).to.be.equal('temp1');
    });
    it('should return response with valid token and id, name, and username criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token)
        .set('content-type', 'application/json')
        .send({ id: '1', name: 'temp1', username: 'test1' });
      expect(response).to.have.status(200);
      expect(response.body[0].name).to.be.equal('temp1');
    });
    it('should return error response with valid token but invalid criteria', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', token)
        .set('content-type', 'application/json')
        .send({ name: 'garbage' });
      expect(response).to.have.status(400);
    });
    it('should return error response with invalid valid token', async () => {
      const response = await request(app)
        .post('/cats')
        .set('authToken', 'garbage');
      expect(response).to.have.status(403);
    });
  });

  describe('/cats/random endpoint', () => {
    it('Should return a random entry', async () => {
      const firstResponse = await request(app).get('/cats/random');
      const secondResponse = await request(app).get('/cats/random');
      expect(firstResponse).to.have.status(200);
      expect(secondResponse).to.have.status(200);
      expect(firstResponse.body.name).to.be.not.equal(secondResponse.body.name);
    });
  });

  after(async () => {
    await deleteRecords();
  });
});
