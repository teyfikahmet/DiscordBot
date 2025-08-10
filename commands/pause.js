import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { pausePlayer } from '../utils/musicManager.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('pause')
		.setNameLocalizations({Turkish : "duraklat"})
		.setDescription('Şarkıyı duraklat'),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		return await interaction.reply(pausePlayer(interaction.guild.id) ? "Müzik duraklatıldı." : "Şu an çalan müzik yok veya zaten duraklatılmış.")
	}
}