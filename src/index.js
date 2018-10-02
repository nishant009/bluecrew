import '@babel/polyfill';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { register, login } from './cat';
import { root, random } from './cats';
import { getConnection, closeConnection } from './db_utils';
import { end } from './cache_utils';
import logger from './logger';

import { version } from '../package.json';

const app = express();
const port = process.env.PORT || 3000;

function getVersion(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({ version });
}

function shutDown() {
  logger.info('Received kill signal, shutting down...');
  closeConnection();
  end();
  process.exit(0);
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

app.use(cors());

app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', getVersion);

app.post('/cat/register', register);

app.post('/cat/login', login);

app.post('/cats', root);

app.get('/cats/random', random);

(async () => {
  if (await getConnection()) {
    app.listen(port, () => logger.info(`Started listening on port ${port}...`));
  } else {
    logger.error('Error starting application.');
    process.exit(1);
  }
})();

export default app;
