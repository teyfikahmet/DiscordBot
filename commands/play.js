import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { addToQueue, isPlaying, Play, BuildMusicInfoEmbed, CreateGuildPlayer, PlayIndex, ClearQueue } from '../utils/musicManager.js'
import { isValidUrl } from '../utils/helper.js';
import { getPlaylistItems, GetVideoInfo, isPlaylist, isVideo, YoutubeSearch, isShortVideo } from '../utils/youtube.js';

export default
{
	data: new SlashCommandBuilder()
		.setName('play')
		.setNameLocalization("tr", "çal")
		.setDescription('Plays music via YouTube link or search.')
		.setDescriptionLocalization("tr", "YouTube linki veya arama ile müzik çalar.")
		.addStringOption(option => option.setName('query')
			.setNameLocalization("tr", "sorgu")
			.setDescription("YouTube video linki gir veya şarkı ara.")
			.setDescriptionLocalization("tr", 'YouTube video linki gir veya şarkı ara.')
			.setRequired(true)),
			/**
			 * 
			 * @param {CommandInteraction} interaction 
			 */
	async execute(interaction){
		let query = interaction.options.getString('query');

		if(!query)
			return interaction.reply("⚠️ Komut hatası.")

		const guild = interaction.guild
		const member = interaction.member

		if(!member.voice.channel)
			return interaction.reply("🔇 Bir ses kanalında olman gerek.")

		if(!isValidUrl(query))
		{
			const url = await YoutubeSearch(query)
			if(url)
				query = url
		}
		const videoId = isVideo(query)
		const plist = isPlaylist(query)
		const isShort = isShortVideo(query)

		if(videoId || isShort)
		{
			const info = await GetVideoInfo(isShort ? isShort : videoId)
			if(!info)
				return await interaction.reply("❌ Çalacak bir şey bulunamadı.")
			
			if(!isPlaying(guild.id))
			{
				await Play(guild, query, member.voice.channel.id, interaction.channel.id)
				const index = addToQueue(guild.id, query, info, member.id, true)
				return await interaction.reply({embeds: [BuildMusicInfoEmbed(info, member.id, index)]});
			}

			const index = addToQueue(guild.id, query, info, member.id)
			return await interaction.reply(`▶️ Listeye Eklendi #${index}: ${info.title}`);
		}
		else if(plist)
		{
			const items = await getPlaylistItems(plist)
			if(items && items.length > 0)
			{
				await CreateGuildPlayer(guild, member.voice.channel.id, interaction.channel.id)
				// ClearQueue(interaction.guild.id)
			}
			await interaction.reply("🎶 Playlist kuyruğa alındı, ekleniyor...");

			let addedItems = [];
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const url = `https://www.youtube.com/watch?v=${item.videoId}`
				const info = await GetVideoInfo(item.videoId)
				if(!info)
					continue
				const index = addToQueue(guild.id, url, info, member.id, false)
				if(index)
					addedItems.push(index)
			}

			await interaction.followUp(`${addedItems.length} adet şarkı listeye eklendi...`)

			if(addedItems.length > 0 && !isPlaying(guild.id))
				PlayIndex(guild, 0)

			return
		}
	}
}