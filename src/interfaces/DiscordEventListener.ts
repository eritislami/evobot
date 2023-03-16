export interface DiscordEventListener {
	name: string;
	once?: boolean;
	execute(...args: any): Promise<any> | void;
}
