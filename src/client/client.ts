import { Client as DiscordClient, Collection, Intents } from 'discord.js'
import DiscordCollecionTypes from '../types/declarations/discord'
import { removeFileExtension } from '../utils/functions'
import { existsSync, readdirSync } from 'fs'
import config from '../config/config.json'
import { ConfigI } from '../types/config'
import { logger } from '../utils/logger'
import path from 'path'

export class Client {
  public client: DiscordClient

  private config: ConfigI

  constructor() {
    this.config = config
    ;(this.client = new DiscordClient({
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
    })),
      (this.client.commands = new Collection())
  }

  initCommands() {
    if (existsSync(path.resolve(__dirname, '../commands'))) {
      readdirSync(path.resolve(__dirname, '../commands')).forEach(
        async (commandFile) => {
          const command = (await import(`../commands/${commandFile}`)).default
          this.client.commands.set(command.name, command)
        }
      )

      return
    }

    logger.error(`YOU DON'T HAVE THE COMMANDS FOLDER`)
  }

  initEvents() {
    if (existsSync(path.resolve(__dirname, '../events'))) {
      readdirSync(path.resolve(__dirname, '../events')).forEach(
        async (eventFile) => {
          const { default: execute } = await import(`../events/${eventFile}`)
          let eventName = removeFileExtension(eventFile)
          this.client.on(eventName, (...args) => execute(...args, this.client))
        }
      )

      return
    }

    logger.error(`YOU DON'T HAVE THE EVENTS FOLDER`)
  }

  init() {
    this.initCommands()
    this.initEvents()
    this.client
      .login(this.config.CLIENT.TOKEN)
      .then(() => {
        logger.info(`Client connected with succes !`)
      })
      .catch((err) => {
        logger.error(`error while connecting the client: ${err}`)
        process.exit(1)
      })
  }
}
