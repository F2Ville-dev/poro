import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../types/BotCommand";

const ping: BotCommand = {
	options: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	execute: async (interaction, client) => {
		await interaction.reply('Pong!');
	}
}

export default ping;