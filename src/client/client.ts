import { Client as DiscordClient, Collection, Intents } from 'discord.js'
import { removeFileExtension } from '../utils/functions'
import { existsSync, readdirSync } from 'fs'
import { logger } from '../utils/logger'
import { config } from 'dotenv'
import path from 'path'

export class Client {
  public client: DiscordClient
  public config: any
  public commandsCollection: any

  constructor() {
    this.config = config()
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


  initCommands() {
    if(existsSync(path.resolve(__dirname, '../commands'))) {
      readdirSync(path.resolve(__dirname, '../commands')).forEach(async commandFile => {
        const command = (await import(`../commands/${commandFile}`)).default
        this.commandsCollection.set(command.name, command)
      })

      return
    }

    logger.error(`YOU DON'T HAVE THE COMMANDS FOLDER`)
  }

  initEvents() {
    if(existsSync(path.resolve(__dirname, '../events'))) {
      readdirSync(path.resolve(__dirname, '../events')).forEach(async eventName => {
        const { default: execute } = await import(`../events/${eventName}`)
        let event = removeFileExtension(eventName)
        this.client.on(event, (...args) => execute(...args, this.client))
      })

      return
    }

    logger.error(`YOU DON'T HAVE THE EVENTS FOLDER`)
  }


  init() {
    this.initCommands()
    this.initEvents()
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
