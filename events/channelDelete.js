const { Events } = require("discord.js");

module.exports = {
    name: Events.ChannelDelete,
    execute: async(channel) => {
        try {
            let channelId = channel.id
            if (cachedTickets[channelId]) delete cachedTickets[channelId];
        } catch (err) { return console.error(err) }
    }
}