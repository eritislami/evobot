import axios from 'axios';
import cheerio from 'cheerio';
import { Song } from "../structs/Song";
import { ChatInputCommandInteraction, EmbedBuilder, TextChannel, GuildMember } from 'discord.js';
import { Playlist } from "../structs/Playlist";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { MusicQueue } from "../structs/MusicQueue";
import { joinVoiceChannel, DiscordGatewayAdapterCreator } from "@discordjs/voice";


// Funktion zum Extrahieren der Song-IDs aus den Apple Music Links
function getSongId(appleMusicLink: string): string | null {
    console.log(`Extrahiere Song ID aus dem Link: ${appleMusicLink}`);
    const parsedUrl = new URL(appleMusicLink);
    if (parsedUrl.pathname.includes('song')) {
      const songId = parsedUrl.pathname.split('/').pop() || null;
      console.log(`Extrahierte Song ID: ${songId}`);
      return songId;
    } else {
      const songId = parsedUrl.searchParams.get('i');
      console.log(`Extrahierte alternative Song ID: ${songId}`);
      return songId;
    }
  }
  
  // Funktion zum Abrufen der Links aus der Playlist
  async function getLinks(url: string): Promise<string[]> {
    console.log(`Abrufen der Links aus der Playlist-URL: ${url}`);
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const appleLinks = $('meta[property="music:song"]').toArray();
    const links = appleLinks.map(element => $(element).attr('content') || '');
    console.log(`Gefundene Links: ${links.join(', ')}`);
    return links;
  }
  
  // Funktion zum Abrufen von Songlinks von der Odesli API
  async function getOdesliLink(songId: string): Promise<string | null> {
    console.log(`Abrufen des YouTube-Links für Song ID: ${songId}`);
    if (!songId) {
      console.log("Song ID ist null, überspringe die Anfrage.");
      return null;
    }
  
    try {
      const apiUrl = `https://api.song.link/v1-alpha.1/links?id=${songId}&platform=appleMusic&type=song`;
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        const data = response.data;
        const youtubeUrl = data.linksByPlatform.youtube?.url || null;
        console.log(`Gefundener YouTube-Link: ${youtubeUrl}`);
        return youtubeUrl;
      } else {
        console.error(`Fehler beim Abrufen der Daten für Song ID ${songId}: ${response.status} ${response.statusText}`, response.data);
        return null;
      }
    } catch (error) {
      console.error(`Fehler beim Abrufen des YouTube-Links für Apple Music Song ID ${songId}:`, error);
      return null;
    }
  }
  
  async function processAppleMusicPlaylist(url: string, interaction: ChatInputCommandInteraction): Promise<void> {
    const links = await getLinks(url);
    if (links.length === 0) {
      sendEmptyPlaylistMessage(interaction, url);
      return;
    }
  
    // Verarbeite die ersten beiden Songs und warte, bis beide abgeschlossen sind
    const firstTwoSongs = links.slice(0, 2);
    await Promise.all(firstTwoSongs.map((link, index) => processSong(link, index, interaction)));
  
    // Nachdem die ersten zwei Songs verarbeitet wurden, überprüfe die Warteschlange
    const queue = bot.queues.get(interaction.guild!.id);
    if (!queue || queue.songs.length === 0) {
      sendEmptyPlaylistMessage(interaction, url);
      return;
    }
  
    // Verarbeite den Rest der Songs im Hintergrund
    const remainingSongs = links.slice(2);
    remainingSongs.forEach((link, index) => processSong(link, index + 2, interaction));
  }
  
  async function sendEmptyPlaylistMessage(interaction: ChatInputCommandInteraction, url: string) {
    let playlistEmbed = new EmbedBuilder()
      .setTitle(url)
      .setDescription("Keine Lieder in der Playlist gefunden.")
      .setColor("#F8AA2A")
      .setTimestamp();
  
    await interaction.editReply({
      content: "Die Playlist wurde verarbeitet, aber es wurden keine Songs gefunden.",
      embeds: [playlistEmbed]
    });
  }
  
  async function processSong(link: string, index: number, interaction: ChatInputCommandInteraction): Promise<void> {
    const songId = getSongId(link);
    if (!songId) return;

    const youtubeUrl = await getOdesliLink(songId);
    if (!youtubeUrl) return;

    try {
        const song = await Song.from(youtubeUrl, youtubeUrl);

        if (!interaction.guild) return;
        let queue = bot.queues.get(interaction.guild.id);

        // Sicherstellen, dass interaction.member ein GuildMember ist
        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return;

        if (!queue) {
            const channel = interaction.member.voice.channel;
            queue = new MusicQueue({
                interaction,
                textChannel: interaction.channel as TextChannel,
                connection: joinVoiceChannel({
                    channelId: channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
                }),
            });

            bot.queues.set(interaction.guild.id, queue);
        }

        queue.enqueue(song);

        // Stellen Sie sicher, dass queue eine play-Methode hat
        if ('play' in queue) {
            if (index < 2 || !queue.isPlaying) {
                queue.play();
            }
        }
    } catch (error) {
        console.error(`Fehler beim Verarbeiten des Songs ${link}: ${error}`);
    }
}

  
  export { processAppleMusicPlaylist };