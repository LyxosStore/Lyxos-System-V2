const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate a message')
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('Text to translate')
                .setRequired(true)
            )
        .addStringOption(option =>
            option
                .setName('target')
                .setDescription('The language in which it should be translated | example: en, de')
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        let text = interaction.options.getString('text') || ""
        let translateTo = interaction.options.getString('target') || "en"
        let embed

        await translatte(text, {to: translateTo}).then(res => {

        embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Translation:`)
            .addFields(
                {
                    name: `Recognized Language:`,
                    value: `__${res.from.language.iso || "error"}__`,
                    inline: false
                },
                {
                    name: `Original Text:`,
                    value: "```json" + `\n${JSON.stringify(text, null, 2)}\n` + "```",
                    inline: false
                },
                {
                    name: `Translated Text:`,
                    value: "```json" + `\n${JSON.stringify(res.text, null, 2)}\n` + "```",
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        }).catch(err => {
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription(`# Ohhh, i think i can't help you! ❌\n\nAn error occurred while translating the text... :x:`)
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        });

        await interaction.reply(
            {
                embeds: [embed]
            }
        )
    }
};