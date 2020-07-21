const config = require('./config.json')

const { ShardingManager } = require('discord.js');
const shard = new ShardingManager('./index.js', {
  token: config.TOKEN,
  autoSpawn: true
});

shard.spawn(2);

shard.on('launch', shard => console.log(`[SHARD] Shard ${shard.id}/${shard.totalShards}`));
