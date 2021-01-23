const firebase = require('./firebase')

module.exports = {
    handleRequest(client, req, res) {
        if (req.url == '/favicon.ico') {
            return;
        }
        console.log(`${req.url} requested from: ${req.client.remoteAddress}`)

        if (req.url == '/test') {
            res.writeHead(200, {"Access-Control-Allow-Origin": "*"});
            firebase.getAllSongHistory().then(result => {
                res.end(JSON.stringify({result}, null, 2));
            });
        } else if (req.url == '/topsongs') {
            res.writeHead(200, {"Access-Control-Allow-Origin": "*"});
            firebase.getMostPlayedSongs(5).then(result => {
                res.end(JSON.stringify(result, null, 2))
            });
        } else {
            res.writeHead(200, {"Access-Control-Allow-Origin": "*"});
            let songs = [];
            client.queue.forEach(value => value.songs.forEach(song => songs.push(song)));
            res.end(JSON.stringify({songs}, null, 2));
        }
    }
}