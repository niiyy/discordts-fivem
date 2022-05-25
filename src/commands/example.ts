import { Client, Message } from 'discord.js'

export default {
  // The command name.
  name: 'example',
  // The command aliases.
  aliases: ['ex', 'exmp'],
  // the command permission needed to be executed. [] for no permissions.
  requiredPermissions: ['MANAGE_MESSAGES'],
  // Your callback
  execute: async (message: Message, args: any[], client: Client) => {
    console.log('Command executed !')
  },
}
