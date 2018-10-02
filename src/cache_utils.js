import redis from 'redis';
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
    logger.info('Successfully executed cache query.');
    return reply;
  } catch (error) {
    logger.error(`Cache query execution failed with error: ${error}`);
    return null;
  }
}

export function set(key, value, time = 900) {
  client.set(key, value, 'EX', time);
}

export function end() {
  client.end(false);
}
