import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function importCommands(client) {
  const commandFiles = readdirSync(join(__dirname, "..", "commands")).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = await import(join(__dirname, "..", "commands", `${file}`));
    client.commands.set(command.default.name, command.default);
  }
}
