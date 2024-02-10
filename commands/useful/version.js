const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('View the curreent Version of the Bot'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Current Version:\n\nThe bot is currently running the version: ${sysPackage.version}`)
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        
            await interaction.reply(
            {
                embeds: [embed]
            }
        )
	},
};