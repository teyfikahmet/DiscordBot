import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { pausePlayer } from '../utils/musicManager.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('pause')
		.setNameLocalization("tr", "duraklat")
		.setDescription('Pause player')
		.setDescriptionLocalization("tr", 'Oynatıcıyı duraklat.'),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		return await interaction.reply(pausePlayer(interaction.guild.id) ? "Müzik duraklatıldı." : {
			content: "Şu an çalan müzik yok veya zaten duraklatılmış.",
			flags: "Ephemeral"
		})
	}
}