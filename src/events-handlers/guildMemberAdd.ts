import {
  Client,
  ColorResolvable,
  GuildMember,
  MessageEmbed,
  TextChannel,
} from 'discord.js'
import { getChannel } from '../utils/functions'
import config from '../config/config.json'
import { logger } from '../utils/logger'
import { t } from 'i18next'

const createWelcomeMessageEmbed = (member: GuildMember) => {
  const welcomeEmbed = new MessageEmbed()

    .setColor(
      (config.GUILD_MEMBER_ADD.WELCOME_MESSAGE
        .EMBED_COLOR as ColorResolvable) ?? ('#FF0000' as ColorResolvable)
    )
    .setDescription(
      t('EVENTS.WELCOME_MESSAGE', {
        member: member.user.username,
      })
    )
    .setTimestamp()

  return welcomeEmbed
}

export const sendWelcomeMessage = async (member: GuildMember) => {
  if (!config.GUILD_MEMBER_ADD.WELCOME_MESSAGE.ACTIVE) return

  const channel = await getChannel(
    member.guild,
    config.GUILD_MEMBER_ADD.WELCOME_MESSAGE.CHANNEL
  )

  if (!channel) {
    logger.error(t('EVENTS.INVALID_CHANNEL'))
    return
  }

  const embed: MessageEmbed = createWelcomeMessageEmbed(member)

  ;(channel as TextChannel).send({ embeds: [embed] })
}
