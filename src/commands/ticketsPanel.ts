import {
  CategoryChannel,
  Client,
  Guild,
  Message,
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
  MessageEmbed,
} from 'discord.js'
import { t } from 'i18next'
import config from '../config/config.json'
import { CategorieI } from '../types/config'
import { logger } from '../utils/logger'
import {
  deleteMessage,
  doesCategorieExist,
  randomColor,
  responseEmbed,
  saveJson,
  uuid,
} from '../utils/misc'

const createTicketsEmbed = (message: Message): MessageEmbed => {
  const guildName = message.guild?.name as string
  const guildIcon = message.guild?.iconURL() as string

  const embed = new MessageEmbed()
    .setAuthor(guildName, guildIcon)
    .setDescription(
      t('TICKETS.REACT_TO_CREATE_TICKET')
    )
    .setColor(randomColor())
    .setTimestamp()
    .setFooter(guildName, guildIcon)

  return embed
}

const createButtonsRow = (
  categories: Array<CategorieI>,
  message: Message
): { row: MessageActionRow; embed: MessageEmbed } => {
  const row = new MessageActionRow()

  categories.forEach(categorie => {
    const id = uuid()
    categorie.ID = id

    setTimeout(() => {
      saveJson('config')
    }, 100)

    row.addComponents(
      new MessageButton()
        .setLabel(categorie.BUTTON.NAME || 'no name')
        .setStyle(categorie.BUTTON.TYPE as MessageButtonStyleResolvable)
        .setEmoji(categorie.BUTTON.EMOJI)
        .setCustomId(id)
    )
  })

  const embed = createTicketsEmbed(message)

  return {
    row,
    embed,
  }
}

const setCategoriePermissions = (categorie: CategoryChannel | null): void => {
  if (config.TICKETS.STAFF_ROLES.length !== 0 && categorie) {
    config.TICKETS.STAFF_ROLES.forEach(role => {
      categorie?.permissionOverwrites
        .create(role, {
          VIEW_CHANNEL: true,
        })
        .then(() => {
          logger.info(
            `Permission setted for role: ${role} in category: ${categorie.name}`
          )
        })
        .catch(err => {
          logger.error(
            `Can't set permission for role: ${role} | [ERROR]: ${err}`
          )
        })
    })
  }
}

const setUpCategories = (categories: Array<CategorieI>, guild: Guild): void => {
  categories.forEach(async categorie => {
    let createdCatgorie: CategoryChannel | null = null
    await doesCategorieExist(categorie.NAME, guild).catch(async () => {
      createdCatgorie = await guild.channels.create(categorie.NAME, {
        type: 'GUILD_CATEGORY',
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: ['VIEW_CHANNEL'],
          },
        ],
      })
    })

    if (createdCatgorie) {
      categorie.CATID = (createdCatgorie as CategoryChannel).id
      setTimeout(() => {
        saveJson('config')
      }, 100)
    }

    setCategoriePermissions(createdCatgorie)
  })

  if (config.TICKETS.STAFF_ROLES.length === 0) {
    logger.warn(`You didn't provide any staff role for tickets !`)
  }
}

export default {
  name: 'ticketsPanel',
  aliases: ['tp'],
  requiredPermissions: ['ADMINISTRATOR'],
  execute: async (message: Message, args: any[], client: Client) => {
    if (!config.TICKETS.ACTIVE) {
      const embed: MessageEmbed = responseEmbed({
        message: t('TICKETS.TICKETS_NOT_ACTIVATED'),
        type: 'error',
      })

      message.channel.send({ embeds: [embed] }).then(deleteMessage)

      return
    }

    if (config.TICKETS.CATEGORIES.length === 0) {
      const embed: MessageEmbed = responseEmbed({
        message: t('TICKETS.NO_CATEGORYS'),
        type: 'error',
      })

      message.channel.send({ embeds: [embed] }).then(deleteMessage)

      return
    }

    const { row, embed } = createButtonsRow(config.TICKETS.CATEGORIES, message)
    setUpCategories(config.TICKETS.CATEGORIES, message.guild as Guild)

    message.channel.send({ components: [row], embeds: [embed] })
  },
}
