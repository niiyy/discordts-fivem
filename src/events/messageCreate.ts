import { isMessageCommand } from '../events-handlers/messageCreate'
import { Client, Message } from 'discord.js'

export default (message: Message, client: Client) => {
  isMessageCommand(message, client)
}
