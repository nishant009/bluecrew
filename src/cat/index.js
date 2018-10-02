import _ from 'lodash';
import hat from 'hat';
import logger from '../logger';
import { query } from '../db_utils';
import { set } from '../cache_utils';

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

  res.setHeader('Content-Type', 'application/json');
  res.json({ username: results[0].username });
}

export async function login(req, res) {
  const { username, password } = req.body;

  let results = await query({
    sql: 'SELECT `id`, `password` FROM `cat` WHERE `username` = ?',
    values: [username]
  });

  // TODO: Send an error response down the chain.
  if (_.isNull(results) || _.isEmpty(results)) {
    logger.debug('No such user.');
    res.status(200).send('No such user.');
    return;
  }

  // TODO: Send an error response down the chain.
  if (password !== results[0].password) {
    logger.debug('Wrong password.');
    res.status(200).send('Wrong password.');
    return;
  }

  const { id } = results[0];
  results = await query({
    sql: 'UPDATE `cat` SET `lastSeenAt` = NOW() WHERE `username` = ?',
    values: [username]
  });

  const token = hat();
  set(id, token);
  res.setHeader('Content-Type', 'application/json');
  res.json({ authToken: token });
}
