import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { ClearQueue } from '../utils/musicManager.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('clear')
		.setNameLocalizations({Turkish : "temizle"})
		.setDescription('Çalma listesini temizler.'),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		return await interaction.reply(ClearQueue(interaction.guild.id) ? "Liste temizlendi." : "Liste şuanda zaten boş.")
	}
}