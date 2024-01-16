# 🤖 EvoBot (Discord Music Bot)

![Node build](https://github.com/drewburr-labs/evobot/actions/workflows/node-build.yml/badge.svg) ![Docker build](https://github.com/drewburr-labs/evobot/actions/workflows/docker-build-and-publish.yml/badge.svg) ![Helm build](https://github.com/drewburr-labs/evobot/actions/workflows/helm-publish.yml/badge.svg) [![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/evobot)](https://artifacthub.io/packages/search?repo=evobot)
 [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![logo](https://repository-images.githubusercontent.com/186841818/8aa95700-7730-11e9-84be-e80f28520325)

> EvoBot is a Discord Music Bot built with TypeScript, discord.js & uses Command Handler from [discordjs.guide](https://discordjs.guide)

## 📝 Features & Commands

- 🎶 Play music from YouTube via url or search query

`/play https://www.youtube.com/watch?v=GLvohMXgcBo`
`/play under the bridge red hot chili peppers`

- 🔎 Search and select music to play

`/search Pearl Jam`

- 📃 Play youtube playlists via url or search query

`/playlist https://www.youtube.com/watch?v=YlUKcNNmywk&list=PL5RNCwK3GIO13SR_o57bGJCEmqFAwq82c`
`/playlist linkin park meteora`

- Multi-lingual, with [27 languages supported](./docs/locales.md)

## 🎧 Commands

- Display all commands and descriptions (/help)

- Music controls:
  - Plays audio from YouTube (/play)
  - Show now playing song (/nowplaying)
  - Pause the currently playing music (/pause)
  - Skip the currently playing song (/skip)
  - Toggle music loop (/loop)
  - Change volume of currently playing music (/volume)
  - Get lyrics for the currently playing song (/lyrics)
  - Stops the music (/stop)
  - Resume currently playing music (/resume)
- Queue controls:
  - Add song to queue (/play)
  - Play a playlist from youtube (/playlist)
  - Search and select videos to play (/search)
  - Remove song from the queue (/remove)
  - Show the music queue and now playing (/queue)
  - Move songs around in the queue (/move)
  - Shuffle queue (/shuffle)
  - Skip to the selected queue number (/skipto)
- Clips:
  - Plays a clip sound (/clip)
  - List all clips (/clips)
- Bot settings:
  - Toggle pruning of bot messages (/pruning)
  - Show the bot's average ping (/ping)
  - Check the uptime (/uptime)
  - Send bot invite link (/invite)

Media Controls available via Reactions

![reactions](https://i.imgur.com/0hdUX1C.png)

## 🚀 Getting Started

1. Generate a Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**

2. Enable `Message Content Intent` in Discord Developer Portal

3. Use both the `bot` and `applications.commands` scopes, and enable the following permissions:

    - View Channels
    - Send Messages
    - Manage Messages
    - Connect (Voice)
    - Speak (Voice)

4. Copy or rename `config.json.example` to `config.json` and enter the Discord Bot Token for `TOKEN`

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

## 👾 CLI configuration

Install Node.js 18.19.0 or newer then run the following commands:

```sh
git clone https://github.com/eritislami/evobot.git
cd evobot
npm install
```

After the installation finishes run `npm run start` to start the bot.

## 🐬 Docker Configuration

For those who would prefer to use our [Docker container](https://hub.docker.com/repository/docker/eritislami/evobot), you may provide values from `config.json` as environment variables.

```shell
docker run -e "TOKEN=<discord-token>" eritislami/evobot
```

## 🤝 Contributing

Please see the [Contributing](./CONTRIBUTING.md) documentation for contribution steps.
