import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'debug';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(winston.format.simple()),
  transports: [new winston.transports.Console({ colorize: true })]
});

export default logger;
