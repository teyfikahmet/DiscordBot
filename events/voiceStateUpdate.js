import {Client, VoiceState } from 'discord.js'
import { stopPlayer } from '../utils/musicManager.js';
export const name = 'voiceStateUpdate';
export const once = false;

/**
 * 
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 * @param {Client} client 
 */
export async function execute(oldState, newState, client) {
	const botId = client.user.id;
	if (newState.member.id !== botId) return;
	if (oldState.channelId && !newState.channelId)
	{
		const guildId = newState.guild.id;
		stopPlayer(guildId)
		console.log("Bot kanaldan çıktı ve veriler temizlendi...");
	}
}