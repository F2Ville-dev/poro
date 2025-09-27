import type { CommandInteraction, SlashCommandBuilder } from "discord.js"
import type { ExtendedClient } from "../ExtendedClient";

type BotCommand = {
	options: SlashCommandBuilder;
	execute: (interaction: CommandInteraction, client: ExtendedClient, ...args: any[]) => Promise<void>;
}

export type { BotCommand };