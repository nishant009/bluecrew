import redis from 'redis';
import _ from 'lodash';
import logger from './logger';

const config = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || '6379'
};

const client = redis.createClient(config);

client.on('error', error =>
  logger.error(`Connecting to redis failed with error ${error}`)
);

function getWrapper(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (error, reply) => {
      if (error) {
        reject(error);
      } else {
        resolve(reply);
      }
    });
  });
}

export async function get(key) {
  try {
    const reply = await getWrapper(key);
    logger.info(`Successfully executed cache query for key: ${key}`);
    return reply;
  } catch (error) {
    logger.error(`Cache query execution failed with error: ${error}`);
    return null;
  }
}

export function set(key, value, time) {
  const expiry = _.isNil(time) ? 900000 : time;
  client.set(key, value, 'PX', expiry);
}

export function end() {
  client.end(false);
}
