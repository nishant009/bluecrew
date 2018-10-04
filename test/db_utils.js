import _ from 'lodash';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { query } from '../src/db_utils';

describe('Query execution', () => {
  it('Should successfully execute a valid query', async () => {
    const queryString = 'DESC `cat`';
    const results = await query({ sql: queryString });
    expect(_.isNil(results[0])).to.be.equal(false);
  });
  it('Should properly handle an invalid query', async () => {
    const queryString = 'SELECT `id` FROM `cat` WHERE error';
    const results = await query({ sql: queryString });
    expect(_.isNil(results)).to.be.equal(true);
  });
});
