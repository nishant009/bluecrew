import _ from 'lodash';
import logger from '../logger';
import { query } from '../db_utils';
import { get } from '../cache_utils';

// Generate a random number between the interval [1, max]
function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

export async function root(req, res) {
  const authToken = req.get('authToken');
  const { id, name, username } = req.body;
  let dbQuery =
    'SELECT `id`, `name`, `username`, `breed`, `imageUrl`, `birthDate` FROM `cat`';

  const result = await get(authToken);
  // TODO: Send an error response down the chain.
  if (_.isNil(result)) {
    logger.debug('Invalid authToken');
    res.status(204).send();
    return;
  }

  let addWhereClause = true;
  if (!_.isNil(id) && !_.isEmpty(id)) {
    addWhereClause = false;
    dbQuery += ` WHERE \`id\` = ${id}`;
  }
  if (!_.isNil(name) && !_.isEmpty(name)) {
    if (addWhereClause) {
      addWhereClause = false;
      dbQuery += ` WHERE \`name\` = '${name}'`;
    } else {
      dbQuery += ` AND \`name\` = '${name}'`;
    }
  }
  if (!_.isNil(username) && !_.isEmpty(username)) {
    if (addWhereClause) {
      dbQuery += ` WHERE \`username\` = '${username}'`;
    } else {
      dbQuery += ` AND \`username\` = '${username}'`;
    }
  }
  dbQuery += ' ORDER BY `lastSeenAt` LIMIT 10';

  logger.debug(`query: ${dbQuery}`);
  const results = await query({
    sql: dbQuery
  });

  // TODO: Send an error response down the chain.
  if (_.isNil(results)) {
    logger.debug('No results found, sending empty response.');
    res.status(204).send();
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(results);
}

export async function random(req, res) {
  const ids = await query({
    sql: 'SELECT MAX(`id`) as maxId FROM `cat`'
  });

  const { maxId } = _.isNil(ids) ? null : ids[0];
  logger.debug(`Max ID is ${maxId}`);

  // TODO: Send an error response down the chain.
  if (_.isNil(maxId)) {
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
  if (_.isNil(results)) {
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
