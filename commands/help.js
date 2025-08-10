import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('help')
		.setNameLocalizations({Turkish : "yardım"})
		.setDescription('Yardım'),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		
	}
}