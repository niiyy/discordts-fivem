import { Client, Message } from "discord.js"



export default (message: Message, client: Client) => {
  console.log(message.content)
}