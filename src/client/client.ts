import { Client as DiscordClient, Collection, Intents } from 'discord.js'
import { logger } from '../utils/logger'
import { config } from 'dotenv'
import fs from 'node:fs'

export class Client {
  public client: DiscordClient
  public config: any
  public commandsCollection: any

  constructor() {
    this.config = config({ path: './src/config/.env' })
    this.commandsCollection = new Collection()
    this.client = new DiscordClient({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      ],
      partials: ['CHANNEL', 'USER', 'GUILD_MEMBER', 'MESSAGE', 'USER'],
    })
  }


  init() {
    this.client
      .login(this.config.parsed.CLIENT_TOKEN)
      .then(() => {
        logger.info(`Client connected with succes !`)
      })
      .catch(err => {
        logger.error(`error while connecting the client: ${err}`)
        process.exit(1)
      })
  }
}
