export function checkPermissions(command, message) {
  if (!command.permissions) return true;

  const { channel } = message.member.voice;
  const requiredPermissions = command.permissions;
  const permissions = channel.permissionsFor(message.client.user);

  if (!permissions.has(requiredPermissions)) {
    throw new MissingPermissionsException(permissions.missing(requiredPermissions));
  }

  return true;
}

function MissingPermissionsException(permissions) {
  this.message = "Missing permissions:";
  this.permissions = permissions;

  this.toString = function () {
    return `${this.message} ${this.permissions.join(", ")}`;
  };
}
