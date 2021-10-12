const axios = require("axios").default;
const { YOUTUBE_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require("../util/Util");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

const spotify = (() => {
  var _token = null;
  var _tokenType = null;
  var _nextRefresh = null;

  const isValidURL = (url) => url.startsWith("https://open.spotify.com/");
  const isSong = (url) => isValidURL(url) && url.includes("track");
  const isAlbum = (url) => isValidURL(url) && url.includes("album");
  const isArtist = (url) => isValidURL(url) && url.includes("artist");
  const isPlaylist = (url) => isValidURL(url) && url.includes("playlist");

  const getHeaders = async () => {
    const newToken = await getToken();
    return {
      Authorization: `${_tokenType} ${newToken}`,
      "Content-Type": "application/json"
    };
  };

  const getToken = async () => {
    if (_token && _nextRefresh && new Date().valueOf() < _nextRefresh) {
      return _token;
    } else {
      await login();
      return _token;
    }
  };

  const login = async () => {
    const authToken = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
    return await axios
      .post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then((res) => res.data)
      .then((data) => {
        _token = data.access_token;
        _tokenType = data.token_type;
        _nextRefresh = new Date().valueOf() + data.expires_in;
        console.log("Spotify connected");
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  const getTrackInfo = async (url) => {
    let newURL = url.replace("https://open.spotify.com/track/", "https://api.spotify.com/v1/tracks/");

    newURL = removeSearchParams(newURL).toString();
    const headers = await getHeaders();
    return axios
      .get(newURL, {
        headers: headers
      })
      .then((res) => res.data)
      .then((data) => ({
        title: data.name,
        artist: data.artists[0].name,
        album: data.album.name
      }));
  };
  const getPlaylistInfo = async (url) => {
    let newURL = url.replace("https://open.spotify.com/playlist/", "https://api.spotify.com/v1/playlists/");
    newURL = removeSearchParams(newURL);
    newURL.searchParams.append(
      "fields",
      "name%2Cexternal_urls.spotify%2Ctracks(items(track.name%2Ctrack.album.name%2Ctrack.artists.name))"
    );
    newURL = newURL.toString();

    const headers = await getHeaders();
    return axios
      .get(newURL, {
        headers: headers
      })
      .then((res) => res.data)
      .then((data) => {
        const newArr = data.tracks.items.map((data) => ({
          title: data.track.name,
          artist: data.track.artists[0].name,
          album: data.track.album.name
        }));

        return {
          title: data.name,
          url: data.external_urls.spotify,
          items: newArr
        };
      });
  };

  const getAlbumInfo = async (url) => {
    let newURL = url.replace("https://open.spotify.com/album/", "https://api.spotify.com/v1/albums/");

    newURL = removeSearchParams(newURL).toString();

    const headers = await getHeaders();
    return axios
      .get(newURL, {
        headers: headers
      })
      .then((res) => res.data)
      .then((data) => {
        const newArr = data.tracks.items.map((it) => ({
          title: it.name,
          artist: it.artists[0].name,
          album: data.name
        }));

        return {
          title: `${data.artists[0].name} ${data.name}`,
          url: data.external_urls.spotify,
          items: newArr
        };
      });
  };

  const getArtistTopTracks = async (url) => {
    const newURL = new URL(url);
    newURL.searchParams.append("market", "PE");
    const headers = await getHeaders();
    return axios
      .get(newURL.toString(), {
        headers: headers
      })
      .then((res) => res.data)
      .then((data) => {
        return data.tracks.map((it) => ({
          title: it.name,
          artist: it.artists[0].name,
          album: it.album.name
        }));
      });
  };

  const removeSearchParams = (url) => {
    let tempURL = new URL(url);
    let arrayKeys = [];
    tempURL.searchParams.forEach((v, k) => {
      arrayKeys.push(k);
    });
    arrayKeys.forEach((k) => {
      tempURL.searchParams.delete(k);
    });
    return tempURL;
  };

  const getArtistInfo = async (url) => {
    let newURL = url.replace("https://open.spotify.com/artist/", "https://api.spotify.com/v1/artists/");
    let urlObj = removeSearchParams(newURL);
    urlObj.searchParams.append("market", "PE");
    newURL = urlObj.toString();

    const headers = await getHeaders();

    return axios
      .get(newURL, {
        headers: headers
      })
      .then((res) => res.data)
      .then(async (data) => {
        let tracks = await getArtistTopTracks(data.href + "/top-tracks");

        return {
          title: `${data.name} Top Tracks`,
          url: data.external_urls.spotify,
          items: tracks
        };
      });
  };

  const getInfo = async (url) => {
    if (isSong(url)) {
      return getTrackInfo(url);
    } else if (isPlaylist(url)) {
      return getPlaylistInfo(url);
    } else if (isAlbum(url)) {
      return getAlbumInfo(url);
    } else if (isArtist(url)) {
      return getArtistInfo(url);
    }
  };

  return {
    login: login,
    getToken: getToken,
    getInfo: getInfo,
    validator: {
      url: isValidURL,
      song: isSong,
      album: isAlbum,
      artist: isArtist,
      playlist: isPlaylist
    }
  };
})();

module.exports = spotify;
