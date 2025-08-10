import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js'

export default
{
	data: new SlashCommandBuilder()
		.setName('help')
		.setNameLocalizations({"tr" : "yardım"})
		.setDescription('Help')
		.setDescriptionLocalization("tr", "Yardım"),
		/**
		 * 
		 * @param {CommandInteraction} interaction 
		 */
	async execute(interaction){
		const commands = interaction.client.commands;
		const locale = interaction.guild?.preferredLocale || 'en';
		
		const embed = new EmbedBuilder()
			.setTitle(locale.startsWith('tr') ? 'Komut Listesi' : 'Command List')
			.setColor('#00AAFF')
			.setFooter({text: `${interaction.client.user.tag} a music bot.`});

		for (const command of commands.values()) {
			let name = command.data.name;
			let description = command.data.description;
			let isDisabled = command?.isDisabled ? command?.isDisabled : false
			if(isDisabled)
				continue

			if (locale.startsWith('tr')) {
				if (command.data.name_localizations?.tr) name = command.data.name_localizations.tr;
				if (command.data.description_localizations?.tr) description = command.data.description_localizations.tr;
			}
			embed.addFields({ name: `/${name}`, value: description ?? '...', });
		}
		await interaction.reply({ 
			embeds: [embed], 
			flags: "Ephemeral" 
		});
	}
}