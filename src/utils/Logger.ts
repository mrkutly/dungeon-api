import winston, { format } from 'winston';

const addTimeStamp = format((info) => {
  info.message = `\x1b[36m${new Date().toISOString()}\x1b[0m - ${info.message}`;
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
      level: 'debug'
    }),
  ],

});

export default Logger;