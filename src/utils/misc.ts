import {
  ColorResolvable,
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  MessageEmbed,
} from 'discord.js'
import { SimpleEmbedI } from '../types/function'
import config from '../config/config.json'
import axios from 'axios'
import { writeFile } from 'fs'
import path from 'path'

const DELETE_MESSAGE_TIMEOUT: number = 7_500
const UUID_MAX_INT: number = 999_999_999
const COLORS: ReadonlyArray<string> = ['AQUA', 'GREEN', 'YELLOW', 'PURPLE', 'GREY', 'ORANGE']

/**
 * @param {string} fileName The file to remove the extension.
 * @returns File without extension.
 */
export const removeFileExtension = (fileName: string): string => {
  const fileArray = fileName.split('.')
  fileArray.pop()
  return fileArray.join('.')
}

/**
 * @param {Guild} src The guild.
 * @param {string} id Member id to get
 * @returns The member.
 */
export const getMember = (src: any, id: string): Promise<GuildMember> =>
  src.members.fetch(id)

/**
 * @param {Guild} src The guild.
 * @param {string} id Channel id to get
 * @returns The channel.
 */
export const getChannel = (src: any, id: string): Promise<GuildChannel> =>
  src.channels.fetch(id)

/**
 * @param {Message} message The message to delete.
 */
export const deleteMessage = (message: Message): void => {
  setTimeout(() => {
    message.delete()
  }, DELETE_MESSAGE_TIMEOUT)
}

/**
 * @param {Message} message your message.
 * @param {string} type your embed type can be ('error' | 'succes')
 */
export const responseEmbed = ({ message, type }: SimpleEmbedI): MessageEmbed => {
  const color: ColorResolvable = type === 'error' ? '#FF0000' : '#2EFF00'
  const embed: MessageEmbed = new MessageEmbed()
    .setDescription(message)
    .setColor(color)
    .setTimestamp()

  return embed
}

/**
 * @returns A random uuid.
 */
export const uuid = (): string =>
  Math.floor(Math.random() * UUID_MAX_INT).toString(16)

/**
 * @returns A random color.
 */
export const randomColor = (): ColorResolvable => {
  const int = Math.floor(Math.random() * COLORS.length)
  return COLORS[int] as ColorResolvable
}

/**
 * * THE TYPE CAN BE CHANGED IN NEXT V.
 */
export const saveJson = (type: 'config'): void => {
  const file = type === 'config' ? config : null
  const filePath =
    type === 'config' ? path.resolve(__dirname, '../config/config.json') : null
  writeFile(filePath as string, JSON.stringify(file, null, 4), err => {
    err ? console.log(err) : null
  })
}


/**
 * 
 * @param categorieName The category name
 * @param src The guild.
 * @returns A Promise.
 */

export const doesCategorieExist = (
  categorieName: string,
  src: Guild
): Promise<any> => {
  return new Promise((res, rej) => {
    src.channels.fetch().then(channels => {
      channels.forEach(channel => {
        if (
          channel.name.toUpperCase() === categorieName.toUpperCase() &&
          channel.type === 'GUILD_CATEGORY'
        ) {
          res('')
        }
      })

      rej('')
    })
  })
}

type fetchServerT = (actionType: 'players' | 'info') => Promise<any>

/**
 * @param {string} actionType Data type.
 */
export const fetchServer: fetchServerT = async actionType => {
  const resp = await axios.get(
    `http://${config.FIVEM.IP}:${config.FIVEM.PORT}/${actionType}.json`
  )

  return resp
}
