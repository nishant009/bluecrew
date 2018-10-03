import { describe, it } from 'mocha';
import { expect, request } from 'chai';
import app from '../src/index';
import { version } from '../package.json';

describe('Status and content of healthcheck', () => {
  describe('healthcheck', () => {
    it('should have status 200', async () => {
      const response = await request(app).get('/');
      expect(response).to.have.status(200);
      expect(response.body.version).to.be.equal(version);
    });
    it('should have package version as content', async () => {
      const response = await request(app).get('/');
      expect(response.body.version).to.be.equal(version);
    });
  });
});
