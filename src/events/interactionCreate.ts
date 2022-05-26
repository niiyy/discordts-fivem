import { Client, Interaction } from 'discord.js'
import { handleInteraction } from '../events-handlers/interactionCreate'

export default (interaction: Interaction, client: Client) => {
  handleInteraction(interaction)
}
