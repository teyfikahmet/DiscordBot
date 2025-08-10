import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { BuildMusicInfoEmbed, SkipPlayer } from '../utils/musicManager.js';

export default
{
	data: new SlashCommandBuilder()
		.setName('skip')
		.setNameLocalizations({Turkish : "geç"})
		.setDescription('Şarkıyı atla'),
			/**
			 * 
			 * @param {CommandInteraction} interaction 
			 */
	async execute(interaction){
		const skip = await SkipPlayer(interaction.guild)
		if(skip)
			return await interaction.reply({embeds: [BuildMusicInfoEmbed(skip[0].info, skip[0].member_id, skip[1])]});
		else
			return await interaction.reply("Oynatma listesi boş...")
	}
}