import _ from 'lodash';
import logger from '../logger';
import { query } from '../db_utils';

// Generate a random number between the interval [1, max]
function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

export async function root(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json('Hello World!');
}

export async function random(req, res) {
  const ids = await query({
    sql: 'SELECT MAX(`id`) as maxId FROM `cat`'
  });

  const { maxId } = _.isNull(ids) ? null : ids[0];
  logger.debug(`Max ID is ${maxId}`);

  // TODO: Send an error response down the chain.
  if (_.isNull(maxId)) {
    logger.debug('No results found, sending empty response.');
    res.status(204).send();
    return;
  }

  const randomId = getRandomInt(maxId);
  logger.debug(`Random ID is ${randomId}`);

  const results = await query({
    sql: 'SELECT `name`, `breed`, `imageUrl` FROM `cat` WHERE `id` = ?',
    values: [randomId]
  });

  // TODO: Send an error response down the chain.
  if (_.isNull(results)) {
    logger.debug('No results found, sending empty response.');
    res.status(204).send();
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.json({
    name: results[0].name,
    breed: results[0].breed,
    imageUrl: results[0].imageUrl
  });
}
