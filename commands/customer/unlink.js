const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlink')
        .setDescription('Unlink a Claimed CFX.RE Asset from your Discord-ID'),
    async execute(interaction) {
        // TODO: Creating this Command, Product with Role via MySQL
    },
};