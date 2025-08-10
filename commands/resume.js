import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { unPausePlayer } from '../utils/musicManager.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('resume')
		.setNameLocalizations({Turkish : "devam"})
		.setDescription('Şarkıya devam et'),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		return await interaction.reply(unPausePlayer(interaction.guild.id) ? "Müzik devam ediyor." : "Müzik zaten çalıyor ya da hiçbir şey çalmıyor.")
	}
}