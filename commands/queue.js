import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { GetQueue, isPlaying } from '../utils/musicManager.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('queue')
		.setNameLocalization("tr", "liste")
		.setDescription('Show playlist.')
		.setDescriptionLocalization("tr", 'Çalma listesini göster'),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		const queue = GetQueue(interaction.guild.id)
		if(!queue || queue.items.lenght == 0)
			return await interaction.reply({
				content: "Listede şarkı yok.",
				flags: "Ephemeral"
			})

		const currentPlay = queue.index
		const list = queue.items.map((item, index) => `#${index + 1}: ${item.info.title} ${currentPlay == (index + 1) && isPlaying(interaction.guild.id) ? "**(Oynatılıyor)**" : ""}`).join('\n');

		return await interaction.reply(`**Oynatma Listesi**\n${list}`)
	}
}