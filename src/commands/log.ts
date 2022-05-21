export default {
    // your command name
    name: 'example',
    // your command aliases.
    aliases: ['ex', 'examp', 'example'],
    // your command needed permissions to execute it. you can put an empty array if we dont need permissions.
    requiredPermissions: [
      'MANAGE_MESSAGES',
      'KICK_MEMBERS',
      'MANAGE_CHANNELS',
      'MANAGE_GUILD',
    ],
    execute: async () => {
        console.log('Message.')
    },
  }