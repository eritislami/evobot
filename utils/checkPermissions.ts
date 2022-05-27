import { Message, PermissionResolvable } from "discord.js";
import { Command } from "../interfaces/Command";

export async function checkPermissions(command: Command, message: Message) {
  const member = await message.guild!.members.fetch({ user: message.client.user!.id });

  if (!command.permissions) return true;
  const requiredPermissions = command.permissions as PermissionResolvable[];

  const { channel } = member!.voice;

  if (channel) {
    const permissions = channel.permissionsFor(member);

    if (!permissions.has(requiredPermissions)) {
      throw new MissingPermissionsException(permissions.missing(requiredPermissions));
    }
  }

  return true;
}

class MissingPermissionsException {
  public message = "Missing permissions:";

  constructor(public permissions: string[]) {}

  public toString() {
    return `${this.message} ${this.permissions.join(", ")}`;
  }
}
