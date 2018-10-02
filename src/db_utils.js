import mysql from 'mysql';
import logger from './logger';

const config = {
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DB || ''
};

const connection = mysql.createConnection(config);

function getConnectionWrapper() {
  return new Promise((resolve, reject) => {
    connection.connect(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function queryWrapper(options) {
  return new Promise((resolve, reject) => {
    connection.query(options, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function closeConnection() {
  connection.destroy();
}

export async function getConnection() {
  try {
    await getConnectionWrapper();
    logger.info('Connected to the database.');
    return true;
  } catch (error) {
    logger.error(`Connecting to database failed with error: ${error}`);
    return false;
  }
}

export async function query(options) {
  try {
    const results = await queryWrapper(options);
    logger.info('Successfully executed query.');
    return results;
  } catch (error) {
    logger.error(`Query execution failed with error: ${error}`);
    return null;
  }
}
