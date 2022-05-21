import { ColorResolvable, GuildMember, Message, MessageEmbed } from 'discord.js'
import { SimpleEmbedI } from '../types/function'
import config from '../config/config.json'
import { logger } from './logger'
import axios from 'axios'

const DELETE_MESSAGE_TIMEOUT: number = 7_500

export const removeFileExtension = (fileName: string): string => {
  const fileArray = fileName.split('.')
  fileArray.pop()
  return fileArray.join('.')
}

export const getMember = (src: any, id: string): Promise<GuildMember> =>
  src.members.fetch(id)

export const deleteMessage = (message: Message) => {
  setTimeout(() => {
    message.delete()
  }, DELETE_MESSAGE_TIMEOUT)
}

export const responseEmbed = ({ message, type }: SimpleEmbedI) => {
  if (!message || !type) return
  const color = type === 'error' ? '#FF0000' : '#2EFF00'
  const embed = new MessageEmbed()
    .setDescription(message)
    .setColor(color)
    .setTimestamp()

  return embed
}

type fetchServerT = (type: 'players' | 'info' | 'both') => Promise<any>

export const fetchServer: fetchServerT = (type) => {
  return new Promise((resolve, reject) => {
    if (type === 'both') {
      axios
        .get(`http://${config.FIVEM.IP}:${config.FIVEM.PORT}/players.json`)
        .then((playersData) => {
          axios
            .get(`http://${config.FIVEM.IP}:${config.FIVEM.PORT}/info.json`)
            .then((serverData) => {
              resolve([playersData, serverData])
            })
            .catch((err) => {
              logger.error(`error while fetching server info:`, err)
              reject(err)
            })
        })
        .catch((err) => {
          logger.error(`error while fetching server players:`, err)
          reject(err)
        })
    }

    axios
      .get(`http://${config.FIVEM.IP}:${config.FIVEM.PORT}/${type}.json`)
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        logger.error(`error while fetching server ${type}:`, err)
        reject(err)
      })
  })
}
