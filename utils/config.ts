import "dotenv/config";
import { Config } from "../interfaces/Config";

let jsonConfig: Config | object
let envConfig: Config
let config: Config;

try {
  jsonConfig = require("../config.json");
} catch (error) {
  console.log("No config.json was found.")
  jsonConfig = {}
}

envConfig = {
  TOKEN: process.env.TOKEN || "",
  DEFAULT_VOLUME: parseInt(process.env.DEFAULT_VOLUME!) || 100,
  LISTENING_ACTIVITY: process.env.ACTIVITY || "",
  LOCALE: process.env.LOCALE || "en",
  MAX_PLAYLIST_SIZE:  parseInt(process.env.MAX_PLAYLIST_SIZE!) || 10,
  PRUNING: process.env.PRUNING === "true" ? true : false,
  STAY_TIME: parseInt(process.env.STAY_TIME!) || 30,
};

// Priority: jsonConfig, envConfig, defaults
config = Object.assign({}, envConfig, jsonConfig)

export { config };
