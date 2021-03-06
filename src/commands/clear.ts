import { Client, Message, MessageEmbed, TextChannel } from 'discord.js'
import { deleteMessage, responseEmbed } from '../utils/misc'
import { logger } from '../utils/logger'
import { t } from 'i18next'

export default {
  name: 'clear',
  aliases: ['cls'],
  requiredPermissions: ['MANAGE_MESSAGES'],
  execute: async (message: Message, args: any[], client: Client) => {
    let amount = args[0]
    if (!amount || isNaN(amount) || amount > 99 || amount < 1) {
      const embed: MessageEmbed = responseEmbed({
        message: t('COMMANDS.CLEAR.AMOUNT_ERROR'),
        type: 'error',
      })
      return message
        .reply({ embeds: [embed] })
        .then(deleteMessage)
        .catch(err => logger.error(`i hate this err: ${err}`))
    }
    ;(message.channel as TextChannel).bulkDelete(amount++).catch(err => {
      logger.error(
        `error while deleting [${amount}] messages in channel: ${
          (message.channel as TextChannel).name
        }, [ERROR]: ${err}`
      )
    })
  },
}
