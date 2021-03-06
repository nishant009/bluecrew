import _ from 'lodash';
import logger from '../logger';
import { query } from '../db_utils';
import { get } from '../cache_utils';

function generateQuerySuffix(id, name, username) {
  let querySuffix = '';
  let addWhereClause = true;
  if (!_.isNil(id) && !_.isEmpty(id)) {
    addWhereClause = false;
    querySuffix += ` WHERE \`id\` = ${id}`;
  }
  if (!_.isNil(name) && !_.isEmpty(name)) {
    if (addWhereClause) {
      addWhereClause = false;
      querySuffix += ` WHERE \`name\` = '${name}'`;
    } else {
      querySuffix += ` AND \`name\` = '${name}'`;
    }
  }
  if (!_.isNil(username) && !_.isEmpty(username)) {
    if (addWhereClause) {
      querySuffix += ` WHERE \`username\` = '${username}'`;
    } else {
      querySuffix += ` AND \`username\` = '${username}'`;
    }
  }
  querySuffix += ' ORDER BY `lastSeenAt` LIMIT 10';
  return querySuffix;
}

export async function root(req, res, next) {
  const authToken = req.get('authToken');
  const { id, name, username } = req.body;

  const result = await get(authToken);
  if (_.isNil(result)) {
    logger.debug('Invalid authToken');
    const error = new Error('Unauthorized access');
    error.status = 403;
    next(error);
    return;
  }

  let dbQuery =
    'SELECT `id`, `name`, `username`, `breed`, `imageUrl`, `birthDate` FROM `cat`';
  dbQuery += generateQuerySuffix(id, name, username);

  logger.debug(`query: ${dbQuery}`);
  const results = await query({
    sql: dbQuery
  });

  if (_.isNil(results) || _.isEmpty(results)) {
    logger.debug('No results found, sending empty response.');
    const error = new Error('No results found.');
    error.status = 400;
    next(error);
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(results);
}

export async function random(req, res, next) {
  const results = await query({
    sql:
      'SELECT `name`, `breed`, `imageUrl` FROM cat AS c1 JOIN (SELECT (RAND() * (SELECT MAX(id) FROM cat)) AS id) AS c2 WHERE c1.id >= c2.id LIMIT 1'
  });

  if (_.isNil(results) || _.isEmpty(results)) {
    logger.debug('No results found, sending empty response.');
    const error = new Error('No results found.');
    error.status = 400;
    next(error);
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.json({
    name: results[0].name,
    breed: results[0].breed,
    imageUrl: results[0].imageUrl
  });
}
