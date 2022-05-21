import { setClientStatus } from '../events-handlers/ready'
import config from '../config/config.json'
import { Client } from 'discord.js'
import { logger } from '../utils/logger'

export default (client: Client) => {
  if (config.CLIENT.STATUS.ACTIVE) {
    if (config.CLIENT.STATUS.REFRESH_INTERVAL < 7_500) {
      logger.error(
        `To prevent your bot from being banned you need to put the refresh interval more then 7500ms`
      )
      return
    }

    const interval = setInterval(() => {
      setClientStatus(client, interval)
    }, config.CLIENT.STATUS.REFRESH_INTERVAL)
  }
}
