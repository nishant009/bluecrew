import _ from 'lodash';
import { describe, it, after } from 'mocha';
import { expect } from 'chai';
import { set, get, end } from '../src/cache_utils';

function sleep(sleepTime) {
  return new Promise(resolve => {
    setTimeout(resolve, sleepTime);
  });
}

describe('Cache operations', () => {
  describe('Set and get key/values', () => {
    it('should set and get key/values passed to it', async () => {
      const key = 'test';
      const value = 'blah';
      set(key, value);
      const result = await get(key);
      expect(result).to.be.equal(value);
    });
  });
  describe('Error handling', () => {
    it('should handle get of a non-existing key', async () => {
      const result = await get('something');
      expect(_.isNil(result)).to.be.equal(true);
    });
  });
  describe('Key expiry', () => {
    it('should expire keys after a provided time', async () => {
      const key = 'some';
      const value = 'dead';
      await set(key, value, 10);
      await sleep(20);
      const result = await get(key);
      expect(_.isNil(result)).to.be.equal(true);
    });
  });
  after(() => {
    end();
  });
});
