import { fetchServer, responseEmbed } from '../utils/functions'
import config from '../config/config.json'
import { logger } from '../utils/logger'
import { Client } from 'discord.js'

export const setClientStatus = (client: Client, interval: NodeJS.Timer) => {

  fetchServer('players')
    .then((data) => {
      console.log('data.data')
      client.user?.setPresence({
        activities: [
          {
            name: `watching ${data.data.length} players`,
          },
        ],
        status: 'online',
      })
    })
    .catch((err) => {
      clearInterval(interval)
      logger.error(
        `an error was occurred while putting client status, [ERROR]: ${err}`
      )
    })
}
