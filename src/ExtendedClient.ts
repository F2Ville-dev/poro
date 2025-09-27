import { PrismaClient } from '@prisma/client';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, IntentsBitField } from 'discord.js';
import type {Interaction} from 'discord.js';
import fs from 'fs';
import type { BotCommand } from './types/BotCommand';
import type { BotEvent } from './types/BotEvent';

interface ExtendedClientOptions {
	token: string;
}

class ExtendedClient extends Client {
	commands: Map<string, BotCommand> = new Map();
	db: PrismaClient = new PrismaClient();

	constructor(options: ExtendedClientOptions) {
		
		super({
			intents: [
				'GuildMembers',
				'Guilds',
				'GuildMessages',
				'MessageContent',
				'GuildMessageReactions',
				'GuildPresences',
				'GuildVoiceStates',
				'GuildBans',
			]
		});
		this.token = options.token;
	}

	async loadCommands() {
		const commandFiles = await fs.promises.readdir('./src/commands');
		for (const file of commandFiles) {
			if (file.endsWith('.ts')) {
				const { default: command } = await import(`./commands/${file}`) as { default: BotCommand };
				this.commands.set(command.options.name, command);
				console.log(`Loaded command ${command.options.name}`);
			}
		}
	}

	async loadEvents() {
		const eventFiles = await fs.promises.readdir('./src/events');
		for (const file of eventFiles) {
			if (file.endsWith('.ts')) {
				const { default: event } = await import(`./events/${file}`) as { default: BotEvent };
				this.on(event.name, (...args) => event.execute(this, ...args));
				console.log(`Loaded event ${event.name}`);
			}
		}
	}

	async registerCommands(guildId: string) {
		const rest = new REST({ version: '10' }).setToken(this.token || '');

		const commands = Array.from(this.commands.values());

		await rest.put(
			Routes.applicationGuildCommands(this.user?.id || '', guildId),
			{ body: commands.map(command => command.options.toJSON()) }
		);
	}

	async handleInteraction(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = this.commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction, this);
			console.log(`Executed command ${interaction.commandName}`);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}

	async start()
	{
		await this.loadCommands();
		await this.loadEvents();
		await this.login(this.token || '');
		this.on('interactionCreate', this.handleInteraction.bind(this));
	}
}

export { ExtendedClient };