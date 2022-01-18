import winston = require("winston");
import * as util from "util";

export const ipcLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        //winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
        winston.format.printf((debug) => {
            const {
             timestamp, level, message, ...args
            } = debug;
         
            const ts = timestamp.slice(0, 19).replace('T', ' ');
            return `${ts} [${level}]: ${message} ${Object.keys(args).length ? util.inspect(args) : ''}`;
           })
          
    ),
    defaultMeta: {
        service: 'test'
    },
    transports: [
        new winston.transports.File({filename: './logs/ipc.log'})
    ]
});

