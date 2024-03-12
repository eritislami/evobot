import axios from 'axios';

// Definiert den Typ für die Plattformen, die wir unterstützen möchten.
type Platform = 'spotify' | 'appleMusic';

// Definiert den Typ für die Antwortstruktur von Odesli API
interface OdesliResponse {
  entityUniqueId: string;
  userCountry: string;
  pageUrl: string;
  linksByPlatform: {
    [key: string]: {  // Änderung hier: Verwendung eines indexierten Typs für Flexibilität
      entityUniqueId: string;
      url: string;
      nativeAppUriMobile?: string;
      nativeAppUriDesktop?: string;
    };
  };
}

// Funktion, um Musiklinks von Spotify oder Apple Music in YouTube-Links umzuwandeln
export async function convertToYouTubeLink(url: string, platform: Platform): Promise<string | null> {
  try {
    const response = await axios.get<OdesliResponse>(`https://api.song.link/v1-alpha.1/links`, {
      params: {
        url: url,
        platform: platform,
        key: '', // Ersetzen Sie dies durch Ihren Odesli API-Schlüssel
      },
    });

    // Überprüft, ob ein YouTube-Link vorhanden ist, bevor auf ihn zugegriffen wird
    if (response.data.linksByPlatform['youtube']) {
      return response.data.linksByPlatform['youtube'].url;
    } else {
      console.error('Kein YouTube-Link gefunden für:', url);
      return null;
    }
  } catch (error) {
    console.error('Fehler beim Umwandeln des Musiklinks:', error);
    return null;
  }
}
