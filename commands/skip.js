import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { BuildMusicInfoEmbed, SkipPlayer } from '../utils/musicManager.js';

export default
{
	data: new SlashCommandBuilder()
		.setName('skip')
		.setNameLocalization("tr", "geç")
		.setDescription('Skip')
		.setDescriptionLocalization("tr", "Atla"),
			/**
			 * 
			 * @param {CommandInteraction} interaction 
			 */
	async execute(interaction){
		const skip = await SkipPlayer(interaction.guild)
		if(skip)
			return await interaction.reply({embeds: [BuildMusicInfoEmbed(skip[0].info, skip[0].member_id, skip[1])]});
		else
			return await interaction.reply({
				content: "Oynatma listesi boş.",
				flags: "Ephemeral"
			})
	}
}