import _ from 'lodash';
import hat from 'hat';
import logger from '../logger';
import { query } from '../db_utils';
import { set } from '../cache_utils';

function isNilOrEmpty(entity) {
  return _.isNil(entity) || _.isEmpty(entity);
}

export async function register(req, res, next) {
  const {
    birthdate,
    breed,
    imageUrl,
    name,
    password,
    username,
    weight
  } = req.body;

  if (
    isNilOrEmpty(name) ||
    isNilOrEmpty(password) ||
    isNilOrEmpty(username) ||
    isNilOrEmpty(weight) ||
    password.length < 8
  ) {
    logger.debug('Invalid request');
    const error = new Error('Bad request.');
    error.status = 400;
    next(error);
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

  if (isNilOrEmpty(results)) {
    logger.debug('Failed to insert');
    const error = new Error('Operation failed.');
    error.status = 400;
    next(error);
    return;
  }

  res.status(204).send();
}

export async function login(req, res, next) {
  const { username, password } = req.body;

  const results = await query({
    sql: 'SELECT `password` FROM `cat` WHERE `username` = ?',
    values: [username]
  });

  if (isNilOrEmpty(results)) {
    logger.debug('No such user.');
    const error = new Error('Bad credentials.');
    error.status = 403;
    next(error);
    return;
  }

  if (password !== results[0].password) {
    logger.debug('Wrong password.');
    const error = new Error('Bad credentials.');
    error.status = 403;
    next(error);
    return;
  }

  await query({
    sql: 'UPDATE `cat` SET `lastSeenAt` = NOW() WHERE `username` = ?',
    values: [username]
  });

  const token = hat();
  set(token, 1);
  res.setHeader('Content-Type', 'application/json');
  res.json({ authToken: token });
}
