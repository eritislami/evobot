# 🤖 Bootleg Rythm (Discord Music Bot)
> Bootleg Rythm is a Discord Music Bot built with discord.js & uses Command Handler from [discordjs.guide](https://discordjs.guide). This project is a fork from [EvoBot](https://github.com/eritislami/evobot). This project is a customization of the bot for our own Discord server

## Requirements

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
2. YouTube Data API v3 Key **[Guide](https://developers.google.com/youtube/v3/getting-started)**  
2.1 **(Optional)** Soundcloud Client ID **[Guide](https://github.com/zackradisic/node-soundcloud-downloader#client-id)**
3. Node.js v14.0.0 or newer

## 🚀 Getting Started 

```sh
git clone https://github.com/jacobkapitein/bootleg-rythm.git
cd bootleg-rythm
npm install
```

After installation finishes follow configuration instructions then run `node index.js` to start the bot.

## ⚙️ Configuration

Copy or Rename `config.json.example` to `config.json` and fill out the values:

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

```json
{
  "TOKEN": "",
  "YOUTUBE_API_KEY": "",
  "SOUNDCLOUD_CLIENT_ID": "",
  "MAX_PLAYLIST_SIZE": 10,
  "PREFIX": "!",
  "PRUNING": false,
  "LOCALE": "en",
  "DEFAULT_VOLUME": 100,
  "STAY_TIME": 30
}
```

Currently available locales are:
- English (en)
- Dutch (nl)

[EvoBot](https://github.com/eritislami/evobot) has more locales available, but as we don't need them, they are not included in this project.

## 📝 Features & Commands

> Note: The default prefix is '/'

* 🎶 Play music from YouTube via url

`!play https://www.youtube.com/watch?v=GLvohMXgcBo`

* 🔎 Play music from YouTube via search query

`!play under the bridge red hot chili peppers`

* 🎶 Play music from Soundcloud via url

`!play https://soundcloud.com/blackhorsebrigade/pearl-jam-alive`

* 🔎 Search and select music to play

`!search Pearl Jam`

Reply with song number or numbers seperated by comma that you wish to play

Examples: `1` or `1,2,3`

* 📃 Play youtube playlists via url

`!playlist https://www.youtube.com/watch?v=YlUKcNNmywk&list=PL5RNCwK3GIO13SR_o57bGJCEmqFAwq82c`

* 🔎 Play youtube playlists via search query

`!playlist linkin park meteora`
* Now Playing (!np)
* Queue system (!queue, !q)
* Loop ! Repeat (!loop)
* Shuffle (!shuffle)
* Volume control (!volume, !v)
* Lyrics (!lyrics, !ly)
* Pause (!pause)
* Resume (!resume, !r)
* Skip (!skip, !s)
* Skip to song # in queue (!skipto, !st)
* Move a song in the queue (!move, !mv)
* Remove song # from queue (!remove, !rm)
* Play an mp3 clip (!clip song.mp3) (put the file in sounds folder)
* List all clips (!clips)
* Show ping to Discord API (!ping)
* Show bot uptime (!uptime)
* Toggle pruning of bot messages (!pruning)
* Help (!help, !h)
* Command Handler from [discordjs.guide](https://discordjs.guide/)
* Media Controls via Reactions

![reactions](https://i.imgur.com/9S7Omf9.png)

## 🤝 Contributing
Contributing to this fork is not really a thing, but members of the server wish for custom functions and contribute them, feel free to fork this project. If you wish to contribute these features to the original author, please refer to [his project](https://github.com/eritislami/evobot).

1. [Fork the repository](https://github.com/jacobkapitein/bootleg-rythm/fork)
2. Clone your fork: `git clone https://github.com/your-username/bootleg-rythm.git`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Stage changes `git add .`
5. Commit your changes: `cz` OR `npm run commit` do not use `git commit`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request

## 📝 Credits

- [@iCrawl](https://github.com/iCrawl) For the queue system used in this application which was adapted from [@iCrawl/discord-music-bot](https://github.com/iCrawl/discord-music-bot)
- [Jacob Kapitein](https://github.com/jacobkapitein) for this fork.