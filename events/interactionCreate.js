import {CommandInteraction, Client } from 'discord.js'
export const name = 'interactionCreate';
export const once = false;

/**
 * 
 * @param {CommandInteraction} interaction 
 * @param {Client} client 
 */
export async function execute(interaction, client) {
	if (!interaction.isChatInputCommand()) return;

	if (!interaction.guild) {
		return interaction.reply({
			content: "❌ Bu komut yalnızca sunucularda kullanılabilir.",
			flags: "Ephemeral"
		});
	}

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		// await interaction.editReply({ content: 'Komutu çalıştırırken hata oluştu!', ephemeral: true });
	}
}