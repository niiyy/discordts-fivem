import { isMessageCommand } from '../events-handlers/messageCreate'
import { Client, GuildMember } from 'discord.js'
import { sendWelcomeMessage } from '../events-handlers/guildMemberAdd'

export default (member: GuildMember, client: Client) => {
  sendWelcomeMessage(member)
}
