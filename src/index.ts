import { config } from 'dotenv';
import { ExtendedClient } from './ExtendedClient';

config();

const client = new ExtendedClient({
	token: process.env.TOKEN as string
})

client.start();