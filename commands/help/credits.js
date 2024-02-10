const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Find the Credits for our Discord-Bot here'),
	async execute(interaction) {

        let githubUrl = "https://github.com/LyxosStore/Lyxos-System-V2"

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Credits:\n\nNot everything in this bot is self-made. Check out our credits and used dependencies here:\n\nGitHub: ${githubUrl}`)
            .addFields(
                {
                    name: `Coded by:`,
                    value: `- ${sysPackage.author}`,
                    inline: false
                },
                {
                    name: `Used Dependencies:`,
                    value: "```json" + `\n${JSON.stringify(sysPackage.dependencies, null, 2)}\n` + "```",
                    inline: false
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