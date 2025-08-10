import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { isPlaying, stopPlayer } from '../utils/musicManager.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('stop')
		.setNameLocalization("tr", "durdur")
		.setDescription("Stops playing music and exits the channel")
		.setDescriptionLocalization("tr", 'Çalan müziği durdurur ve kanaldan çıkar'),
			/**
			 * 
			 * @param {CommandInteraction} interaction 
			 */
	async execute(interaction){
		if(isPlaying(interaction.guild.id))
		{
			stopPlayer(interaction.guild.id)
			return await interaction.reply("Bot durduruldu ve kanalda çıkıldı.")
		}

		return await interaction.reply({
			content: "Şu an çalan müzik yok.",
			flags: "Ephemeral"
		})
	}
}