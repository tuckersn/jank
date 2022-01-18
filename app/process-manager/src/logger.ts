import { createLogger, transports, format } from "winston";

export const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
      new transports.File({ filename: 'logs/process-manager-error.log', level: 'error' }),
      new transports.File({ filename: 'logs/process-manager-info.log' }),
    ],
  });