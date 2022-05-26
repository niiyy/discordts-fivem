import {
  Client,
  Message,
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
  MessageEmbed,
} from 'discord.js'
import config from '../config/config.json'
import { CategorieI } from '../types/config'
import {
  deleteMessage,
  randomColor,
  responseEmbed,
  saveJson,
  uuid,
} from '../utils/misc'

const createTicketsEmbed = (message: Message) => {
  const guildName = message.guild?.name as string
  const guildIcon = message.guild?.iconURL() as string

  const embed = new MessageEmbed()
    .setAuthor(guildName, guildIcon)
    .setDescription(
      `Hello react here to create a ticket using the good categorie.`
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

    if(!categorie.id || categorie.id === "") {
      categorie.id = uuid()
    
      setTimeout(() => {
        saveJson('config')
      }, 100);
    }

    row.addComponents(
      new MessageButton()
        .setLabel(categorie.BUTTON.NAME || 'no name')
        .setStyle(categorie.BUTTON.TYPE as MessageButtonStyleResolvable)
        .setEmoji(categorie.BUTTON.EMOJI || '🤢')
        .setCustomId(uuid())
    )
  })

  const embed = createTicketsEmbed(message)

  return {
    row,
    embed,
  }
}

export default {
  name: 'ticketsPanel',
  aliases: ['tp'],
  requiredPermissions: ['MANAGE_MESSAGES'],
  execute: async (message: Message, args: any[], client: Client) => {
    if (config.TICKETS.CATEGORIES.length === 0) {
      const embed = responseEmbed({
        message: `You have no buttons.`,
        type: 'error',
      })

      message.channel.send({ embeds: [embed] }).then(deleteMessage)

      return
    }

    const { row, embed } = createButtonsRow(config.TICKETS.CATEGORIES, message)

    message.channel.send({ components: [row], embeds: [embed] })
  },
}
