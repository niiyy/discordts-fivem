import { sendWelcomeMessage } from '../events-handlers/guildMemberAdd'
import { Client, GuildMember } from 'discord.js'

export default (member: GuildMember, client: Client) => {
  sendWelcomeMessage(member)
}
