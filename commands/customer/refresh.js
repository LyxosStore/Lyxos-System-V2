const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('Refresh your Claimed CFX.RE Assets'),
    async execute(interaction) {
        // TODO: Creating this Command, Product with Role via MySQL
    },
};