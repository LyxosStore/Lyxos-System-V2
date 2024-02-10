const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tebex')
		.setDescription('Find our Tebex-Shop here'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription('# Our Tebex Shop:\n\nYou can find our Tebex Shop here: https://lyxos.tebex.io/')
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        
            await interaction.reply(
            {
                embeds: [embed]
            }
        )
	},
};