const { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketmessage')
        .setDescription('Generate the Ticket Message')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const embed = getEmbedBase()
            .setDescription(
                `# Ticket Tool:
                 
                Welcome to the Lyxos Store ticket system, we at the support team always try to offer you our help actively.

                **__Rules for ticket support:__**
                > - Keep the chat in English or German.
                > - Always try to remain friendly.
                > - Tagging people is not allowed.

                **__Information:__**
                > - Support time can sometimes take a little longer but we always try to respond as quickly as possible.
                > - The entire chat history in the ticket is saved.`
            )

        const create = new ButtonBuilder()
            .setCustomId('createticket')
            .setLabel('Create Ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('📩');

        const row = new ActionRowBuilder()
            .addComponents(create);

        let message = await interaction.channel.send({
            embeds: [embed],
            components: [row]
        })

        if (message) {
            await sql.query(
                'UPDATE `settings` SET `data` = ? WHERE `settings`.`type` = ?', [message.id, 'ticketmessage'],
                (err, res) => {
                    if (err) {
                        interaction.reply({ content: "A problem was encountered while executing the sql command! Please try again.", ephemeral: true })

                        return console.error(err)
                    }


                    interaction.reply({ content: "Done!", ephemeral: true })

                    return true
                }
            );
        }
    }
};