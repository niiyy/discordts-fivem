import {
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  MessageEmbed,
} from 'discord.js'
import { SimpleEmbedI } from '../types/function'
import config from '../config/config.json'
import { logger } from './logger'
import axios from 'axios'
import { t } from 'i18next'

const DELETE_MESSAGE_TIMEOUT: number = 7_500

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
export const deleteMessage = (message: Message) => {
  setTimeout(() => {
    message.delete()
  }, DELETE_MESSAGE_TIMEOUT)
}

/**
 * @param {Message} message your message.
 * @param {string} type your embed type can be ('error' | 'succes')
 */
export const responseEmbed = ({ message, type }: SimpleEmbedI) => {
  const color = type === 'error' ? '#FF0000' : '#2EFF00'
  const embed = new MessageEmbed()
    .setDescription(message)
    .setColor(color)
    .setTimestamp()

  return embed
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
