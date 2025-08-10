import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('stop')
		.setNameLocalizations({Turkish : "durdur"})
		.setDescription('Çalan müziği durdurur ve kanaldan çıkar'),
			/**
			 * 
			 * @param {CommandInteraction} interaction 
			 */
	async execute(interaction){
		
	}
}