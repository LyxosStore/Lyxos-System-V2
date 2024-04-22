const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('claimedassets')
        .setDescription('View your claimed CFX.RE Asset')
        .addUserOption(option =>
            option
            .setName('user')
            .setDescription('User to check (Admin Only)')
            .setRequired(false)),
    async execute(interaction) {
        let assets = []
        let userId = interaction.user.id
        let user = await interaction.member.guild.members.cache.get(userId)

        let userOption = interaction.options.getUser('user')

        if (userOption && user !== undefined && user.permissions.has(PermissionFlagsBits.Administrator)) {
            userId = userOption.id
        }

        for (var i in claimedAssets) {
            let asset = claimedAssets[i]

            if (asset.claimer == userId) {
                assets.push(asset)
            }
        }


        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription('# Claimed-Assets List from: <@' + userId + '>:\n\n```json\n' + JSON.stringify(assets, null, 2) + '\n```')
            .setTimestamp()
            .setFooter({
                text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`,
                iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png'
            });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    },
};