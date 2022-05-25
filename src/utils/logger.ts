import { createLogger, transports, format } from 'winston'

const logFormat = (log: any): string =>
  `${log.timestamp} [${log.level}]: ${log.message}`

export const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'client.logs.log',
      level: 'silly',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
      ),
    }),
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize({ all: true }),
        format.printf(logFormat)
      ),
    }),
  ],
})
