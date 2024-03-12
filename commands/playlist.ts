import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueue";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { convertToYouTubeLink } from '../utils/musicLinkConverter';
import axios from 'axios';
import { Playlist } from "../structs/Playlist";
import { processAppleMusicPlaylist } from '../utils/appleMusicUtils';
import { Config } from '../interfaces/Config';  // Pfad zur config.ts Datei anpassen
import { config } from '../utils/config';  // Pfad zur config.json Datei anpassen

// Verwenden Sie die Werte aus der Konfiguration
const spotifyClientId = config.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = config.SPOTIFY_CLIENT_SECRET;

async function getSpotifyAccessToken(): Promise<string> {
  const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')}`,
    },
  });
  return tokenResponse.data.access_token;
}

async function extractSongUrlsFromSpotifyPlaylist(playlistUrl: string, accessToken: string): Promise<string[]> {
  const playlistId = playlistUrl.split('/').pop()?.split('?')[0];
  if (!playlistId) return [];
  const headers = { Authorization: `Bearer ${accessToken}` };
  const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { headers });
  const tracks = response.data.items;
  return tracks.map((track: any) => track.track.external_urls.spotify);
}

async function convertLinksToYoutube(interaction: ChatInputCommandInteraction, urls: string[], platform: 'spotify' | 'appleMusic'): Promise<Song[]> {
  const songs: Song[] = [];
  for (const url of urls) {
    const youtubeLink = await convertToYouTubeLink(url, platform);
    if (youtubeLink) {
      // Verwenden Sie die Playlist-Klasse, um Details zum YouTube-Video abzurufen
      let videoDetails = await Playlist.from(youtubeLink);
      songs.push(...videoDetails.videos);
    } else {
      await interaction.followUp({ content: i18n.__mf("playlist.errorNoYoutubeLink", { songUrl: url }), ephemeral: true }).catch(console.error);
    }
  }
  return songs;
}

async function extractSongDetailsFromSpotifyPlaylist(playlistUrl: string, accessToken: string): Promise<{title: string, artist: string, spotifyUrl: string}[]> {
  const playlistId = playlistUrl.split('/').pop()?.split('?')[0];
  if (!playlistId) return [];
  const headers = { Authorization: `Bearer ${accessToken}` };
  const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { headers });
  const items = response.data.items;
  return items.map((item: { track: { name: any; artists: any[]; external_urls: { spotify: any; }; }; }) => ({
    title: item.track.name,
    artist: item.track.artists.map((artist: any) => artist.name).join(", "),
    spotifyUrl: item.track.external_urls.spotify
  }));
}

export default {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription(i18n.__("playlist.description"))
    .addStringOption(option =>
      option.setName("playlist").setDescription("Playlist name or link").setRequired(true)),
  cooldown: 5,
  permissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    if (!interaction.guild) {
      await interaction.editReply("Dieser Befehl kann nicht außerhalb eines Servers verwendet werden.");
      return;
    }

    const argPlaylistUrl = interaction.options.getString("playlist") ?? "";
    const guildMember = interaction.guild.members.cache.get(interaction.user.id);

    // Überprüfen, ob der Kanal ein VoiceChannel ist
    const channel = guildMember?.voice.channel instanceof VoiceChannel ? guildMember.voice.channel : null;

    if (!channel) {
      await interaction.editReply({ content: i18n.__("playlist.errorNotChannel") });
      return;
    }

    if (argPlaylistUrl.includes('spotify.com')) {
      const accessToken = await getSpotifyAccessToken();
      const spotifySongDetails = await extractSongDetailsFromSpotifyPlaylist(argPlaylistUrl, accessToken);
      await processSpotifySongs(interaction, spotifySongDetails, channel);
    } else if (argPlaylistUrl.includes('music.apple.com')) {
      await processAppleMusicPlaylist(argPlaylistUrl, interaction);
    }
  }
};

async function processSpotifySongs(interaction: ChatInputCommandInteraction, songDetails: any[], channel: VoiceChannel) {
  // Warten Sie, bis die ersten zwei Songs verarbeitet wurden, bevor der Rest verarbeitet wird.
  const firstTwoSongs = songDetails.slice(0, 2);
  const remainingSongs = songDetails.slice(2);

  for (const songDetail of firstTwoSongs) {
    await processSong(songDetail, interaction, channel);
  }

  const queue = bot.queues.get(interaction.guild!.id);
  if (!queue || queue.songs.length === 0) {
    await interaction.followUp({ content: "Keine Songs konnten zur Warteschlange hinzugefügt werden." });
    return;
  }

  // Verarbeiten Sie die restlichen Songs im Hintergrund.
  remainingSongs.forEach(songDetail => processSong(songDetail, interaction, channel));
}

async function processSong(songDetail: any, interaction: ChatInputCommandInteraction, channel: VoiceChannel) {
  const youtubeLink = await convertToYouTubeLink(songDetail.spotifyUrl, 'spotify');
  if (!youtubeLink) {
    console.error(`Kein YouTube-Link gefunden für Spotify URL: ${songDetail.spotifyUrl}`);
    return;
  }

  const song = new Song({ title: `${songDetail.title} - ${songDetail.artist}`, url: youtubeLink, duration: 0 });
  let queue = bot.queues.get(interaction.guild!.id);

  if (!queue) {
    queue = new MusicQueue({
      interaction,
      textChannel: interaction.channel as TextChannel,
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
      }),
    });

    bot.queues.set(interaction.guild!.id, queue);
  }

  queue.enqueue(song);
}