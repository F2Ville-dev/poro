import type { GuildMember } from "discord.js";
import type { BotEvent } from "../types/BotEvent";

const memberJoin: BotEvent = {
	name: "guildMemberAdd",
	execute: async (client, member: GuildMember) => {
		console.log(`Member joined: ${member.user.tag}`);
		const guildConfig = await client.db.config.findUnique({
			where: { guildId: member.guild.id }
		})
		console.log(guildConfig);
		if (!guildConfig?.enableJoinMessages) {
			return;
		}
		const channel = guildConfig.joinChannelId ? member.guild.channels.cache.get(guildConfig.joinChannelId as string) : member.guild.systemChannel;
		if (channel && channel.isTextBased()) {
			channel.send(guildConfig.joinMessage?.replace('{user}', `<@${member.id}>`).replace('{server}', member.guild.name) || `Welcome to the server, <@${member.id}>!`);
		} else {
			console.log(`No channel found to welcome ${member.user.tag}`);
		}
	}
};

export default memberJoin;
