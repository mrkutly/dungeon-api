import dotenv from 'dotenv';
import winston, { format } from 'winston';

dotenv.config();
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const addTimeStamp = format((info) => {
  if (logLevel === 'debug') {
    info.message = `\x1b[36m${new Date().toISOString()}\x1b[0m - ${info.message}`;
  } else {
    info.message = `${new Date().toISOString()} - ${info.message}`;
  }
  return info;
});

const Logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: format.combine(
        addTimeStamp(),
        format.colorize(),
        format.simple(),
      ),
      level: logLevel
    }),
  ],

});

export default Logger;