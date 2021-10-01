type Command = {
  name: string;
  aliases?: string[];
  description: string;
  execute: Function;
}
