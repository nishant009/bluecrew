import _ from 'lodash';
import logger from '../logger';
import { query } from '../db_utils';

export async function register(req, res) {
  const results = await query({
    sql: 'SELECT `username` FROM `cat` WHERE `name` = ?',
    values: ['fluffy']
  });

  // TODO: Send an error response down the chain.
  if (_.isNull(results)) {
    logger.debug('No results found, sending empty response.');
    res.status(204).send();
    return;
  }

  res.json({ username: results[0].username });
}

export async function login(req, res) {
  res.json('Hello World!');
}
