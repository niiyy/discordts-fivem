import {
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from 'discord.js'
import { t } from 'i18next'
import config from '../config/config.json'
import { logger } from '../utils/logger'
import { deleteMessage, responseEmbed, uuid } from '../utils/misc'

const findCategorieById = (id: string) =>
  config.TICKETS.CATEGORIES.filter(cat => cat.ID === id)

const closeChannel = (channel: TextChannel): void => {
  const embed: MessageEmbed = responseEmbed({
    message: t('TICKETS.CLOSE_TIMER'),
    type: 'succes',
  })

  channel.send({
    embeds: [embed],
  })

  setTimeout(() => {
    channel.delete()
  }, 5_000)
}

export const handleInteraction = async (interaction: Interaction) => {
  if (!interaction.isButton()) return

  if (interaction.customId.slice(0, 5) === 'close') {
    closeChannel(interaction.channel as TextChannel)

    return
  }

  const categorie: any = findCategorieById(interaction.customId)

  if (!categorie[0]) {
    const embed : MessageEmbed = responseEmbed({
      message: t('TICKETS.CATEGORY_BTN_NOT_FOUND'),
      type: 'error',
    })

    interaction.channel
      ?.send({
        embeds: [embed],
      })
      .then(deleteMessage)

    return
  }

  interaction.guild?.channels
    .create(`${categorie[0].NAME}-${uuid()}`, {
      type: 'GUILD_TEXT',
      parent: categorie[0].CATID,
    })
    .then(channel => {
      const responseEmb = responseEmbed({
        message: t('TICKETS.CHANNEL_CREATED', {
          member: interaction.user.username,
          channelName: channel.name
        }),
        type: 'succes',
      })

      channel.permissionOverwrites
        .create(interaction.member.user.id, {
          VIEW_CHANNEL: true,
        })
        .catch(err =>
          logger.error(`Error while setting you permissions: ${err}`)
        )

      sendMessageToTicketChannel(channel)

      interaction.channel
        ?.send({
          embeds: [responseEmb],
        })
        .then(deleteMessage)
    })
    .catch(err => {
      logger.error(`Can't create the channel [ERROR]: ${err}`)
    })
}

const createRowCloseChannel = (
  channel: TextChannel
): { row: MessageActionRow; embed: MessageEmbed } => {
  const row: MessageActionRow = new MessageActionRow()

  row.addComponents(
    new MessageButton()
      .setStyle('DANGER')
      .setEmoji('🔒')
      .setCustomId(`close-${channel.id}`)
  )

  const embed: MessageEmbed = new MessageEmbed()
    .setDescription(t('TICKETS.CLOSE_TICKET'))
    .setTimestamp()
  return {
    row,
    embed,
  }
}

const sendMessageToTicketChannel = async (channel: TextChannel): Promise<void> => {
  const { embed, row } = await createRowCloseChannel(channel)

  channel.send({
    embeds: [embed],
    components: [row],
  })
}
