import express from 'express';
import winston from 'winston';

const app = express();
const port = process.env.PORT || 3000;
const logLevel = process.env.LOG_LEVEL || 'debug';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(winston.format.simple()),
  transports: [new winston.transports.Console({ colorize: true })]
});

app.set(logger, logger);

// TODO: Remove
function helloWorld(req, res) {
  res.send('Hello World!');
}

app.use('/', helloWorld);

app.listen(port, () => logger.info(`Started listening on port ${port}.`));
