import {
  Client,
  GuildMember,
  Message,
  MessageEmbed,
  PermissionResolvable,
} from 'discord.js'
import { deleteMessage, getMember, responseEmbed } from '../utils/misc'
import config from '../config/config.json'
import { logger } from '../utils/logger'
import { t } from 'i18next'

/**
 * @param {Message} message The message.
 * @param {Array<PermissionResolvable>} permissions Your command permissions.
 * @returns Promise
 */

const hasPermissionsForCommand = (
  message: Message,
  permissions: Array<PermissionResolvable> = []
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (permissions.length == 0) resolve()
    getMember(message.guild, message.author.id)
      .then((member: GuildMember) => {
        permissions.forEach(perm => {
          if (!member.permissions.has(perm))
            reject({
              type: 'MISSING_PERMISSIONS',
              message: t('ERRORS.MISSING_PERMISSIONS'),
            })
        })

        resolve()
      })
      .catch(() =>
        reject({
          type: 'MEMBER_FETCHING',
          message: t('ERRORS.FETCHING_MEMBER'),
        })
      )
  })
}

/**
 * @param {Message} message The message.
 * @param {Client} client Your client instance.
 */

export const isMessageCommand = (message: Message, client: Client): void => {
  if (!message.content.startsWith(config.CLIENT.PREFIX) || message.author.bot)
    return
  const args = message.content.slice(config.CLIENT.PREFIX.length).split(/ +/)
  const commandName = (args.shift() as any).toLowerCase()
  const commandToExecute =
    client?.commands?.get(commandName) ||
    client?.commands?.find(command => command?.aliases?.includes(commandName))
  if (!commandToExecute) return
  try {
    hasPermissionsForCommand(message, commandToExecute.requiredPermissions)
      .then(() => {
        commandToExecute.execute(message, args, client)
      })
      .catch(err => {
        if (err.type == 'MISSING_PERMISSIONS') {
          const embed = responseEmbed({
            message: err.message,
            type: 'error',
          })
          message.reply({ embeds: [embed as MessageEmbed] }).then(deleteMessage)
        }
        if (err.type == 'MEMBER_FETCHING')
          logger.error(
            `error while fetching member permissions: ${err.message}`
          )
      })
  } catch (error) {
    const embed = responseEmbed({
      message: t('ERRORS.COMMAND_NOT_EXECUTED'),
      type: 'error',
    })
    message.reply({ embeds: [embed as MessageEmbed] }).then(deleteMessage)
  }
}
