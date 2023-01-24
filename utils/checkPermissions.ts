import { Message, PermissionResolvable } from "discord.js";
import { Command } from "../interfaces/Command";

export interface PermissionResult {
  result: boolean;
  missing: string[];
}

export async function checkPermissions(command: Command, message: Message): Promise<PermissionResult> {
  const member = await message.guild!.members.fetch({ user: message.client.user!.id });
  const requiredPermissions = command.permissions as PermissionResolvable[];

  if (!command.permissions) return { result: true, missing: [] };

  const missing = member.permissions.missing(requiredPermissions);

  return { result: !Boolean(missing.length), missing };
}
