import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { unPausePlayer } from '../utils/musicManager.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('resume')
		.setNameLocalization("tr", "devam")
		.setDescription('Resume')
		.setDescriptionLocalization("tr", 'Devam et'),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		return await interaction.reply(unPausePlayer(interaction.guild.id) ? "Müzik devam ediyor." : {
			content: "Müzik zaten çalıyor ya da hiçbir şey çalmıyor.",
			flags: "Ephemeral"
		})
	}
}