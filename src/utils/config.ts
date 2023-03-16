import 'dotenv/config';
import { type Config } from '../interfaces/Config';
import configFile from '../../config.json';

export const config: Config = configFile;
