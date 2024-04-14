const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction) {
        let startTime = Date.now();
        let lyxosPing = "-1"
        let apidown = 0

        while (apidown !== 10) {
            https.get('https://api.cloudassets.eu/info', res => {
                apidown = 10

                console.log(res.statusCode)

                if (res.statusCode == 200) {
                    lyxosPing = Math.abs(startTime - Date.now());
                } else {
                    lyxosPing = "(failed)"
                }

            }).on('error', err => {
                if (apidown <= 10) {
                    apidown = apidown + 1
                }
            });

            await sleep(250)
        }

        let gravisSymbol = "``"
        let discordPing = "0"

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Ping:\n\n**Pong 🏓**\n\n**__Discord API:__** ${gravisSymbol}${discordPing}ms${gravisSymbol}\n**__Lyxos API:__** ${gravisSymbol}${lyxosPing}ms${gravisSymbol}`)
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });

        let sendedEmbed = await interaction.reply({ embeds: [embed] })

        discordPing = Math.abs(sendedEmbed.createdTimestamp - startTime);

        embed.setDescription(`# Ping:\n\n**Pong 🏓**\n\n**__Discord API:__** ${gravisSymbol}${discordPing}ms${gravisSymbol}\n**__Lyxos API:__** ${gravisSymbol}${lyxosPing}ms${gravisSymbol}`)

        await interaction.editReply({ embeds: [embed] })
    }
};