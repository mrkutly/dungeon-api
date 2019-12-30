import winston, { format } from 'winston';

const Logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple(),
      ),
      level: 'debug'
    }),
  ],

});

export default Logger;