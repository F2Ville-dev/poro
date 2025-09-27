import type { BotEvent } from "../types/BotEvent";

const clientReady: BotEvent = {
	name: "clientReady",
	execute: async (client) => {
			console.log(`Logged in as ${client.user?.tag}!`);
			const guilds = client.guilds.cache.map(guild => guild.id);
			guilds.forEach(guildId => {
				client.registerCommands(guildId)
					.then(() => console.log(`Registered commands for guild ${guildId}`))
					.catch(console.error);
				const guildConfig = client.db.config.findUnique({
					where: { guildId: guildId }
				}).then(config => {
					if (config) {
						console.log(`Guild ${guildId} config:`, config);
					} else {
						console.log(`No config found for guild ${guildId}`);
						client.db.config.create({
							data: { guildId: guildId }
						}).then(newConfig => {
							console.log(`Created default config for guild ${guildId}:`, newConfig);
						}).catch(err => {
							console.error(`Error creating config for guild ${guildId}:`, err);
						});
					}
				}).catch(err => {
					console.error(`Error fetching config for guild ${guildId}:`, err);
				});
			});
	}
};

export default clientReady;