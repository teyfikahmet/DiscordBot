import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('save_list')
		.setNameLocalizations({Turkish : "listeyi_kaydet"})
		.setDescription('Şuanki listeyi kaydet.')
		.addStringOption(option => 
			option.setName('name')
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