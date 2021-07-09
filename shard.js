const { ShardingManager } = require("discord.js");
const { TOKEN } = require("./util/EvobotUtil");

const shards = new ShardingManager("./index.js", {
  token: TOKEN,
  totalShards: "auto",
});

shards.on("shardCreate", shard => console.log(` || <==> || [${String(new Date).split(" ", 5).join(" ")}] || <==> || Launched Shard #${shard.id} || <==> ||`))

shards.spawn(shards.totalShards, 10000);
