import "dotenv/config";
import { readFile } from "fs/promises";

let config;

try {
  config = JSON.parse(await readFile(new URL("../config.json", import.meta.url)));
} catch (error) {
  config = {
    TOKEN: process.env.TOKEN,
    PREFIX: process.env.PREFIX || "/",
    MAX_PLAYLIST_SIZE: parseInt(process.env.MAX_PLAYLIST_SIZE) || 10,
    PRUNING: process.env.PRUNING === "true" ? true : false,
    STAY_TIME: parseInt(process.env.STAY_TIME) || 30,
    DEFAULT_VOLUME: parseInt(process.env.DEFAULT_VOLUME) || 100,
    LOCALE: process.env.LOCALE || "en"
  };
}

export { config };
