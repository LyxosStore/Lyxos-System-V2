const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    execute: async(message) => {
        let channel = message.channel

        if (!channel) {
            return
        }

        let isTicket = (/^ticket-(open|closed)-\d{4}$/).test(channel.name)
        if (!isTicket) {
            return
        }

        if (cachedTickets[channel.id] === undefined) {
            cachedTickets[channel.id] = {
                messages: [],
                ticketInfo: {}
            }
        }

        cachedTickets[channel.id].messages.push(message.id)

        //cachedTickets[channel.id][message.id] = true
    }
}