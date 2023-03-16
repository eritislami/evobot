import process from 'node:process';
import { pino } from 'pino';

const levels = {
	emerg: 90,
	crit: 80,
	error: 70,
	alert: 60,
	warn: 50,
	notice: 40,
	commands: 30,
	info: 20,
	import: 10,
	debug: 1,
};

const logger = pino({
	// Level: process.env.PINO_LOG_LEVEL || 'debug',
	level: process.env.PINO_LOG_LEVEL ?? 'debug',
	customLevels: levels,
	useOnlyCustomLevels: true,
});
export { logger };
