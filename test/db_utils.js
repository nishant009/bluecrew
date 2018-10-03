import _ from 'lodash';
import { describe, it, after } from 'mocha';
import { expect } from 'chai';
import { closeConnection, query } from '../src/db_utils';

describe('Query execution', () => {
  it('Should successfully execute a valid query', async () => {
    const queryString = 'SELECT COUNT(*) AS count FROM `cat`';
    const results = await query({ sql: queryString });
    expect(results[0].count).to.be.equal(2);
  });
  it('Should properly handle an invalid query', async () => {
    const queryString = 'SELECT `id` FROM `cat` WHERE error';
    const results = await query({ sql: queryString });
    expect(_.isNil(results)).to.be.equal(true);
  });
  after(() => {
    closeConnection();
  });
});
