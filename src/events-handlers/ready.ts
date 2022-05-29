import { fetchServer, responseEmbed } from '../utils/misc'
import config from '../config/config.json'
import { logger } from '../utils/logger'
import { Client } from 'discord.js'
import { t } from 'i18next'

/**
 * @param {Client} client Your client instance.
 * @param {NodeJS.Timer} interval Your interval.
 */

export const setClientStatus = (client: Client, interval: NodeJS.Timer): void => {
  fetchServer('players')
    .then(data => {
      client.user?.setPresence({
        activities: [
          {
            name: t('EVENTS.CLIENT_STATUS', {
              players: data.data.length,
            }),
          },
        ],
        status: 'online',
      })
    })
    .catch(err => {
      clearInterval(interval)
      logger.error(
        t('ERRORS.CLIENT_STATUS', {
          err,
        })
      )
    })
}
