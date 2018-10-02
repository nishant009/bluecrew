import _ from 'lodash';
import hat from 'hat';
import logger from '../logger';
import { query } from '../db_utils';
import { set } from '../cache_utils';

function isNilOrEmpty(entity) {
  return _.isNil(entity) || _.isEmpty(entity);
}

export async function register(req, res) {
  const {
    birthdate,
    breed,
    imageUrl,
    name,
    password,
    username,
    weight
  } = req.body;

  // TODO: Send an error response down the chain.
  if (
    isNilOrEmpty(name) ||
    isNilOrEmpty(password) ||
    isNilOrEmpty(username) ||
    isNilOrEmpty(weight) ||
    password.length < 8
  ) {
    logger.debug('Invalid request');
    res.status(204).send();
    return;
  }

  const results = await query({
    sql:
      'INSERT INTO `cat` (`name`, `username`, `password`, `breed`, `imageUrl`, `addedAt`, `lastSeenAt`, `birthDate`, `weight`) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)',
    values: [
      name,
      username,
      password,
      breed,
      imageUrl,
      birthdate,
      parseFloat(weight)
    ]
  });

  // TODO: Send an error response down the chain.
  if (isNilOrEmpty(results)) {
    logger.debug('Failed to insert');
    res.status(204).send();
    return;
  }

  res.status(204).send();
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
