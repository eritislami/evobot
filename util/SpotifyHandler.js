const SpotifyWebApi = require('spotify-web-api-node');
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require("./EvobotUtil");
class SpotifyHandler extends SpotifyWebApi {
    constructor(options = {clientId: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
        redirectUri: 'http://localhost:8080/callback'}) {
        super(options);
    };
    async _init() {
        let data = await this.clientCredentialsGrant();
        this.setAccessToken(data.body['access_token']);
        setInterval(async () => {
            let data = await this.clientCredentialsGrant();
            this.setAccessToken(data.body['access_token']);
        }, 3600);
    }
    async getPlaylistInfo(url) {
        return this.getPlaylist(url).then(res => {
            res.body.tracks.items.length = 10;
            return {title: res.body.name, tracks: res.body.tracks.items}
        });
    }
}
module.exports = SpotifyHandler
