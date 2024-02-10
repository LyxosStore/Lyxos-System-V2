const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Find our Bot-Stats here'),
	async execute(interaction) {
        let [cpuUsage,ramUsage] = getSystemUsage()

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription('# Our Stats:')
            .addFields(
                {
                    name: `Average CPU Usage:`,
                    value: `${createProgressBar(cpuUsage)}`,
                    inline: true
                },
                {
                    name: `Average RAM Usage:`,
                    value: `${createProgressBar(ramUsage)}`,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        
            await interaction.reply(
            {
                embeds: [embed]
            }
        )
	},
};