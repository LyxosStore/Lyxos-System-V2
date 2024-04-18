const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

function getTokenIdentifier(token, identifier) {
    var token = token
    var identifier = identifier
    var found = false
    var id = 0

    for (var code in helpMessageList) {
        if (helpMessageList[code].problem == token) {
            found = true
            id = code
        }
    }

    if (!found) { return false }

    if (identifier == "problem") {
        if (helpMessageList[id].problem) {
            return helpMessageList[id].problem
        }
    } else if (identifier == "helpmessages") {
        if (helpMessageList[id].helpmessage) {
            return helpMessageList[id].helpmessage
        }
    }

    return false
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Ehhhh, i need help owo')
        .addStringOption(option =>
            option
            .setName('problem')
            .setDescription('The Problem')
            .setRequired(true)),
    async execute(interaction) {
        let embed

        if (getTokenIdentifier([interaction.options.getString('problem')], "problem")) {
            let problem = interaction.options.getString('problem')
            let helpMessage = getTokenIdentifier(problem, "helpmessages")

            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription(`# Your Personal Helper :). ✅\n\n__Your Help:__\n${helpMessage}`)
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        } else {
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription(`# Ohhh, i think i can't help you! ❌\n\nAn error occurred when searching for help pepeSad, either the help does not exist or it is not yet entered in our database... :x:`)
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        }

        if (embed !== undefined) {
            await interaction.reply({
                embeds: [embed]
            })
        }
    }
};