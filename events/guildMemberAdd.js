const { Events } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.GuildMemberAdd,
    execute: async(member) => {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Welcome:\n\n:wave: A new __person__ is on our __discord__, please welcome <@${member.id}>, please check out our Rules: <#${process.env.DISCORD_RULES_CHANNEL}>.`)
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: Automod`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });

        const channel = member.guild.channels.cache.get(process.env.DISCORD_JOIN_CHANNEL)
        
        channel.send(
            { 
                embeds: [embed]
            }
        )

        var role = member.guild.roles.cache.find(role => role.name == process.env.DISCORD_JOIN_ROLE)
        member.roles.add(role);
    }
}