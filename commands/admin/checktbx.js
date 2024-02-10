const { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checktbx')
        .setDescription('Check a Transaction ID')
        .addStringOption(option =>
            option
            .setName('transactionid')
            .setDescription('The Transaction ID')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        let transactionId = interaction.options.getString('transactionid')
        let tried = 0
        let data = false

        https.get(`https://plugin.tebex.io/payments/${transactionId}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Tebex-Secret': process.env.TEBEX_SECRET
            }
        }, (res) => {
            res.on('data', (returnData) => {
                data = JSON.parse(returnData.toString("utf8"))
            });
        });

        while (data == false && tried <= 5) {
            tried = tried + 1

            await sleep(250)
        }

        if (data == false) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription(`# Oh, I think this transaction doesn't exist! ❌\n\nAn error occurred while searching for the specific transaction ID, either the transaction does not exist or there was an error in the query :x:`)
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
            interaction.reply(
                {
                    embeds: [embed]
                }
            )
        } else {
            let gravisSymbol = '``'

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription(`# Transaction: __${transactionId}__\n\n**__Transaction Status:__** ${gravisSymbol}${data.status}${gravisSymbol}\n**__Package(s):__**\n` + '```' + JSON.stringify(data.packages) + '```\n:white_check_mark:')
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });

            const fulldata = new ButtonBuilder()
                .setCustomId('viewfulldata')
                .setLabel('View full information')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder()
                .addComponents(fulldata);

            let reply = await interaction.reply(
                {
                    embeds: [embed],
                    components: [row]
                }
            )

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const btnClick = await reply.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

                if (btnClick.customId === 'viewfulldata') {
                    let dfpr = "* Deleted for privacy reasons *"

                    data.email = dfpr
                    data.player.id = dfpr
                    data.player.name = dfpr
                    data.player.uuid = dfpr

                    const embed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('Project Lyxos')
                        .setDescription(
                            `# Full Information for Transaction: __${transactionId}__
                            __**JSON Data:**__
                            ` + '```' + JSON.stringify(data, null, "  ") + '```'
                        )
                        .setTimestamp()
                        .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });

                    interaction.editReply({ components: [] });
                    await interaction.followUp(
                        {
                            embeds: [embed], 
                            ephemeral: true
                        }
                    );
                }
            } catch (e) {
                await interaction.editReply({ components: [] });
            }
        }
    }
};