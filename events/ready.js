import { Client } from "discord.js";
export const name = 'ready';
export const once = true;

/**
 * 
 * @param {Client} client 
 */
export function execute(client) {
	console.log(`✅ Bot aktif: ${client.user.tag}`);
}