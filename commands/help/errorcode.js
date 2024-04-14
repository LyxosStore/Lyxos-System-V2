const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

setInterval(function() {
    https.get('https://api.cloudassets.eu/geterrorcodes', res => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                if (!data) {
                    return
                }

                errorCodeList = JSON.parse(data)
            } catch (error) {}
        });

    }).on('error', err => {
        console.log('Error while getting error codes: ', err.message);
    });
}, 5000);

function getTokenIdentifier(token, identifier) {
    var token = token
    var identifier = identifier
    var found = false
    var id = 0

    for (var code in errorCodeList) {
        if (errorCodeList[code].errorcode == token) {
            found = true
            id = code
        }
    }

    if (!found) { return false }

    if (identifier == "errorcode") {
        if (errorCodeList[id].errorcode) {
            return errorCodeList[id].errorcode
        }
    } else if (identifier == "fixableForUsers") {
        if (errorCodeList[id].fixableForUsers) {
            return errorCodeList[id].fixableForUsers
        }
    } else if (identifier == "fixableForDevelopers") {
        if (errorCodeList[id].fixableForDevelopers) {
            return errorCodeList[id].fixableForDevelopers
        }
    } else if (identifier == "problemMessage") {
        if (errorCodeList[id].problemMessage) {
            return errorCodeList[id].problemMessage
        }
    } else if (identifier == "fixMessage") {
        if (errorCodeList[id].fixMessage) {
            return errorCodeList[id].fixMessage
        }
    }

    return false
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('errorcode')
        .setDescription('Ehhhh, what does this error code mean? 🥺👉👈')
        .addStringOption(option =>
            option
            .setName('errorcode')
            .setDescription('The error code')
            .setRequired(true)),
    async execute(interaction) {
        let embed

        if (getTokenIdentifier([interaction.options.getString('errorcode')], "errorcode")) {
            let errorCode = interaction.options.getString('errorcode')
            let problemMessage = getTokenIdentifier(errorCode, "problemMessage")
            let fixMessage = getTokenIdentifier(errorCode, "fixMessage")
            let isFixableForNormalUsers = getTokenIdentifier(errorCode, "fixableForUsers")
            let isFixableForDevelopers = getTokenIdentifier(errorCode, "fixableForDevelopers")

            if (isFixableForNormalUsers == 1) {
                isFixableForNormalUsers = "<a:check:1135288130023456768>"
            } else {
                isFixableForNormalUsers = "<a:no:1135288106950590634>"
            }

            if (isFixableForDevelopers == 1) {
                isFixableForDevelopers = "<a:check:1135288130023456768>"
            } else {
                isFixableForDevelopers = "<a:no:1135288106950590634>"
            }

            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription(`# Error code was found. ✅\n\n__The Problem:__\n${problemMessage}\n\n__How to fix it:__\n${fixMessage}\n\n- Fixable for normal users: ${isFixableForNormalUsers}\n- Fixable for developers: ${isFixableForDevelopers}`)
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
        } else {
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription('# Error code not found! ❌\n\nAn error occurred when searching for the error code, either the error code does not exist or it is not yet entered in our database... :x:')
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