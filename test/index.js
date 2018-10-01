import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import app from '../src/index';

describe('Status and content', () => {
  describe('Main page', () => {
    it('status', async () => {
      const response = await request(app).get('/');
      expect(response).to.have.status(200);
    });
  });
});
