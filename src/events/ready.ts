import { setClientStatus } from '../events-handlers/ready'
import config from '../config/config.json'
import { logger } from '../utils/logger'
import { Client } from 'discord.js'
import { t } from 'i18next'


export default (client: Client) => {
  if (config.CLIENT.STATUS.ACTIVE) {
    if (config.CLIENT.STATUS.REFRESH_INTERVAL < 7_500) {
      logger.error(
        t('ERRORS.INTERVAL_ERROR', {
          interval: 7500
        })
      )
      return
    }

    const interval = setInterval(() => {
      setClientStatus(client, interval)
    }, config.CLIENT.STATUS.REFRESH_INTERVAL)
  }
}
