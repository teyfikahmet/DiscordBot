import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('play_list')
		.setNameLocalizations({Turkish : "listeyi_çal"})
		.setDescription('Listeyi çal.')
		.addStringOption(option => option.setName('name')
			.setNameLocalization("tr", "isim")
			.setDescription('Liste ismi.')
			.setRequired(true)),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		
	}
}