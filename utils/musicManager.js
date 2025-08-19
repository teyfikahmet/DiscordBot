
import { VoiceChannel, TextChannel, Guild, EmbedBuilder} from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel} from "@discordjs/voice";
import ytdl from "@distube/ytdl-core";

const players = new Map(); 
// guildId -> { connection, player, queue, voice_channel, text_channel, timeover_event }
// queue = {index, items = [{url, info, member_id}]}

/**
 * 
 * @param {string} guild_id 
 */
export function GetGuildPlayer(guild_id) {
	return players.get(guild_id)
}

/**
 * 
 * @param {string} guild_id 
 * @returns boolen
 */
export function hasGuildData(guild_id) {
	return players.get(guild_id) ? true : false
}

/**
 * 
 * @param {string} guild_id 
 * @returns 
 */
export function GetGuildData(guild_id)
{
	return hasGuildData(guild_id) ? players.get(guild_id) : false
}

/**
 * 
 * @param {Guild} guild 
 */
async function onGuildPlayerIdle(guild)
{
	try {
		const guildData = GetGuildData(guild.id)
		if(!guildData)
			return

		const queue = GetQueue(guild.id)
		if(queue)
		{
			const nextItem = GetNextItem(guild.id)
			if(!nextItem)
				return SendMessageToChannel(guildData.guild, guildData.text_channel, "Listede çalacak başka şarkı kalmadı...")

			guildData.queue.index = guildData.queue.index + 1
			await Play(guild, nextItem.url, guildData.voice_channel, guildData.text_channel)
			return SendMessageToChannel(guildData.guild, guildData.text_channel, {embeds: [BuildMusicInfoEmbed(nextItem.info, nextItem.member_id, guildData.queue.index)]});
		}
	} catch (error) {
		console.error(error)
	}
}

function onGuildPlayerError(player, error) {
	console.error(`AudioPlayerError: ${error.message}`);
	
	try {
		player.stop();
	} catch (e) {
		console.error("Failed to stop player after error:", e);
	}
}

/**
 * 
 * @param {string} guild_id 
 */
export function GetNextItem(guild_id) {
	const guildData = GetGuildData(guild_id)
	if(!guildData)
		return null
	
	const queue = GetQueue(guild_id)
	if(!queue)
		return null

	const currentPlay = queue.index;
	if(currentPlay >= queue.items.length)
		return null

	const nextItem = queue.items.at(currentPlay)
	if(!nextItem)
		return null

	return nextItem
}

/**
 * 
 * @param {Guild} guild 
 * @param {VoiceChannel} voice_channel 
 * @param {TextChannel} text_channel 
 */
export async function CreateGuildPlayer(guild, voice_channel, text_channel){
	try {
		if (hasGuildData(guild.id)) return

		let guildData = {}
		let queue = {index : 0, items : []}
		const connection = joinVoiceChannel({
			channelId: voice_channel,
			guildId: guild.id,
			adapterCreator: guild.voiceAdapterCreator,
		});
		const player = createAudioPlayer();

		connection.subscribe(player);

		player.on(AudioPlayerStatus.Idle, () => onGuildPlayerIdle(guild))
		player.on("error", (error) => onGuildPlayerError(player, error))
		
		guildData = {
			connection, player, queue, voice_channel, text_channel, guild, timeover_event: null
		}
		players.set(guild.id, guildData)

		return guildData
	} catch (error) {
		console.error(error)
		return null
	}
}

/**
 * 
 * @param {string} guild_id 
 * @returns boolen
 */
export function	isPlaying(guild_id)
{
	if (!hasGuildData(guild_id))
		return false
	
	if(!players.get(guild_id).player)
		return false

	if(players.get(guild_id).player.state.status === AudioPlayerStatus.Idle)
		return false

	return true
}

/**
 * 
 * @param {string} guild_id 
 */
export function GetQueue(guild_id)
{
	if(!hasGuildData(guild_id))
		return false

	return players.get(guild_id).queue
}

/**
 * 
 * @param {string} guild_id 
 * @returns 
 */
export function ClearQueue(guild_id) {
	if(!hasGuildData(guild_id))
		return false
	
	players.get(guild_id).queue = {index: 0, items : []}
	return true
}

/**
 * 
 * @param {string} guild_id 
 * @param {string} url 
 * @param {string} title 
 * @param {object} info 
 * @param {string} member_id
 * @param {boolean} isPlaying
 */
export function addToQueue(guild_id, url, info, member_id, isPlaying = false)
{
	if(!hasGuildData(guild_id))
		return false

	const index = players.get(guild_id).queue.items.push({
		url: url,
		info: info,
		member_id: member_id,
	})
	if (isPlaying)
		players.get(guild_id).queue.index = index
	return index
}

/**
 * 
 * @param {object} video_details 
 * @param {string} member_id 
 * @returns 
 */
export function BuildMusicInfoEmbed(info, member_id, listIndex = 1) {
	const embed = new EmbedBuilder()
		.setColor("#ccbf07")
		.setTitle(info.title || "Bilinmeyen Başlık")
		.setThumbnail(info.thumbnail_url || null)
		.addFields({ name: '🎧 Talep Eden', value: `<@${member_id}>`})
		.addFields({ name: 'Liste sırası', value: `#${listIndex}`})
		.setFooter({text: "Oynatılıyor..."})
		.setDescription(info.channelTitle || "Bilinmeyen Kanal");
	return embed
}

export async function PlayResource(params) {
	
}

/**
 * 
 * @param {Guild} guild 
 * @param {string} url 
 * @param {VoiceChannel} voice_channel 
 * @param {TextChannel} text_channel 
 */
export async function Play(guild, url, voice_channel, text_channel){
	let data = players.get(guild.id)
	if(!data)
		data = await CreateGuildPlayer(guild, voice_channel, text_channel)
	
	data.text_channel = text_channel
	
	const stream = await ytdl(url, { filter: 'audioonly', quality: "highestaudio", highWaterMark: 1 << 25, dlChunkSize: 0 });
	const resource = createAudioResource(stream);
	data.player.play(resource)
}

/**
 * 
 * @param {Guild} guild 
 * @param {number} index 
 */
export async function PlayIndex(guild, index) {
	const guildData = GetGuildData(guild.id)
	if(!guildData)
		return
	const queue = GetQueue(guild.id)
	if(queue)
	{
		const itemLenght = queue.items.length;
		const textChannel = await guild.channels.fetch(guildData.text_channel.id)
		if (index >= itemLenght)
			return SendMessageToChannel(guild, guildData.text_channel, "Oynatma sırasında hata oluştu.")
		const item = queue.items.at(index)
		if (!item)
			return SendMessageToChannel(guild, guildData.text_channel, "Oynatma sırasında hata oluştu.")
		guildData.queue.index = index + 1
		await Play(guild, item.url, guildData.voice_channel, guildData.text_channel)
		return SendMessageToChannel(guildData.guild, guildData.text_channel, {embeds: [BuildMusicInfoEmbed(item.info, item.member_id, guildData.queue.index)]})
	}
}

/**
 * 
 * @param {string} guildId 
 * @returns 
 */
export function stopPlayer(guildId) {
	const data = players.get(guildId);
	if (!data) return;

	data.player.stop();
	data.connection.destroy();
	players.delete(guildId);
}

/**
 * 
 * @param {string} guild_id 
 * @returns 
 */
export function pausePlayer(guild_id)
{
	const data = players.get(guild_id);
	if (!data) return false;;

	if(!data.player) return false;;

	if(!isPlaying(guild_id)) return false;;

	data.player.pause()
	return true
}

/**
 * 
 * @param {string} guild_id 
 * @returns 
 */
export function unPausePlayer(guild_id)
{
	const data = players.get(guild_id);
	if (!data) return false;;

	if(!data.player) return false;;

	if(!isPlaying(guild_id)) return false;

	data.player.unpause()
	return true
}

/**
 * 
 * @param {Guild} guild 
 * @returns 
 */
export async function SkipPlayer(guild)
{
	const data = players.get(guild.id);
	if (!data) 
		return false;

	const queue = GetQueue(guild.id)
	if(!queue)
		return false

	if(!isPlaying(guild.id))
		return false

	let nextItem = GetNextItem(guild.id)
	if(!nextItem)
	{
		if (data.queue.index == queue.items.length && queue.items.length > 1)
			nextItem = queue.items.at(0)
		else
			return false
	}
	data.player.stop();
	if(nextItem == queue.items.at(0))
		data.queue.index = 1
	else
		data.queue.index = data.queue.index + 1

	await Play(guild, nextItem.url, data.voice_channel, data.text_channel)
	return [nextItem, data.queue.index]
}

/**
 * 
 * @param {Guild} guild 
 * @param {number} channelId 
 */
async function SendMessageToChannel(guild, channelId, data) {
	try {
		const channel = await guild.channels.fetch(channelId);
		if(!channel)
		{
			console.error({text: "Kanal bulanamadıği için Mesaj gönderilemedi", data})
			return
		}

		await channel.send(data)
	} catch (error) {
		console.log(error.message);
	}
}