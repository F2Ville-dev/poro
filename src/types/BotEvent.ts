import type { ClientEvents } from "discord.js"
import type { ExtendedClient } from "../ExtendedClient";

type BotEvent = {
	name: keyof ClientEvents;
	execute: (client: ExtendedClient, ...args: any[]) => Promise<void>;
}

export type { BotEvent };