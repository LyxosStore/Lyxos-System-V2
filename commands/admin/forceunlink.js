const { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forceunlink')
        .setDescription('Force-Unlink a claimed CFX.RE Asset')
        .addStringOption(option =>
            option
            .setName('transactionid')
            .setDescription('The Transaction ID')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        let transactionId = interaction.options.getString('transactionid')
        let claimed = false

        for (var i in claimedAssets) {
            if (claimedAssets[i].transactionId == transactionId) {
                claimed = true
            }
        }

        let embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Oh, I think this transaction doesn't exist! ❌\n\nAn error occurred while searching for the specific transaction ID, either the transaction does not exist or there was an error in the query :x:`)
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });


        if (!claimed) {
            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            sql.query("DELETE FROM userClaimedData WHERE transactionId = ?", [
                transactionId
            ], async function(error) {
                if (error) {
                    console.error(error)

                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                } else {
                    embed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('Project Lyxos')
                        .setDescription(`# Asset Unclaimed! :white_check_mark:\n\n You have successfully force unclaimed the asset! (**YOU NEED TO REMOVE THEM THE ROLES MANUALLY!**) :white_check_mark:`)
                        .setTimestamp()
                        .setFooter({
                            text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`,
                            iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png'
                        });


                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                }
            })
        }
    }
};