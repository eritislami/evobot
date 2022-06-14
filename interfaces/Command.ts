export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  permissions?: string[];
  cooldown?: number;
  execute(...args: any): any;
}
