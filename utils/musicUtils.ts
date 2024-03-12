// utils/musicUtils.ts
import axios from 'axios';
import { config } from './config'; // Importiere die Konfiguration aus config.ts

export const getSpotifyAccessToken = async () => {
  const { data } = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    }
  );
  return data.access_token;
};

export const getSpotifyTracks = async (playlistUrl: string) => {
  const accessToken = await getSpotifyAccessToken();
  const playlistId = playlistUrl.split('/').pop()?.split('?')[0];
  const { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data.items.map((item: any) => item.track.external_urls.spotify);
};

export const getOdesliLink = async (trackUrl: string) => {
  const { data } = await axios.get(`https://api.song.link/v1-alpha.1/links?url=${trackUrl}`);
  return data.linksByPlatform.youtube.url;
};
