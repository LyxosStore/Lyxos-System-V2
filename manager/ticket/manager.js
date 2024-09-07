const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    OverwriteType,
    ChannelType,
    PermissionFlagsBits,
    Collection,
} = require('discord.js')

const fs = require('node:fs')
const request = require('request');

const ticketReasons = {
    ["question"]: { emoji: "0️⃣", text: "Question(s)" },
    ["bug"]: { emoji: "1️⃣", text: "Bug(s) / Script Error(s) / Problem(s)" },
    ["server"]: {
        emoji: "2️⃣",
        text: "How to join Server?",
        quickAnswer: "We don't have a server, we are just a FiveM shop, we have nothing to do with any other server :=)"
    }
}

addInteraction("createticket", async function(interaction, extraData) {
    let description = (
        `# Ticket Creation:
            
        **Why do you want to create a ticket?**`
    )

    const row = new ActionRowBuilder()

    for (const type in ticketReasons) {
        let data = ticketReasons[type]
        description =
            `${description}
            > - ${data.emoji} | ${data.text}`

        const button = new ButtonBuilder()
            .setCustomId(`ticket_create::${type}`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(data.emoji);

        row.addComponents(button)

    }

    let embed = getEmbedBase()
        .setDescription(description)

    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
        components: [row]
    })
})

const closeRow = new ActionRowBuilder()
const closeButton = new ButtonBuilder()
    .setCustomId(`ticket_buttons::close`)
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Close Ticket')
    .setEmoji('🔒');

closeRow.addComponents(closeButton)

addInteraction("ticket_create", async function(interaction, type) {
    let quickAnswer = ticketReasons[type].quickAnswer

    if (quickAnswer) {
        const embed = getEmbedBase()
            .setDescription(
                `# Quick-Answer:
                
                **__Your question has already been answered, read here:__**
                ${quickAnswer}`
            )

        return await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    await interaction.reply({ content: "Creating ticket, please wait..", ephemeral: true })

    try {
        let category = await interaction.guild.channels.cache.find(c => c.name.indexOf("tickets") !== -1 && c.type == ChannelType.GuildCategory)
        let ticketCount = String(category.children.cache.size).padStart(4, '0')
        let ticketName = `ticket-open-${ticketCount}`
        let ticket = await interaction.guild.channels.create({
            name: ticketName,
            type: ChannelType.GuildText,
            parent: category,
        });

        if (ticket) {
            await ticket.permissionOverwrites.create(interaction.user, {
                ViewChannel: true,
            });

            await interaction.editReply({ content: `Your ticket has been created! View your ticket here: <#${ticket.id}>` })

            let embed = getEmbedBase()
                .setDescription(
                    `# Ticket #${ticketCount}:
                    Hello <@${interaction.user.id}> this is your personal ticket, we ask you to write your request here in the chat.\n# Reminder:

                    **__Rules for ticket support:__**
                    > - Keep the chat in English or German.
                    > - Always try to remain friendly.
                    > - Tagging people is not allowed.

                    **__Information:__**
                    > - Support time can sometimes take a little longer but we always try to respond as quickly as possible.
                    > - The entire chat history in the ticket is saved.`
                )
                .addFields({
                    name: 'Creator-Discord-ID:',
                    value: `\`${interaction.user.id}\``,
                    inline: true
                }, {
                    name: 'Ticket-Reason:',
                    value: `\`${type}\``,
                    inline: true
                })


            if (!cachedTickets[ticket.id]) cachedTickets[ticket.id] = { messages: [], ticketInfo: {} };
            cachedTickets[ticket.id].ticketInfo = {
                "Creator": interaction.user.id,
                "Reason": type,
                "Channel-Name": ticketName,
                "Timestamp": getTime()
            }

            await ticket.send({ embeds: [embed], components: [closeRow] })
        }
    } catch (err) {
        console.error(err)

        return await interaction.editReply({ content: "A problem was encountered while creating your ticket.." })
    }
})

const possibleActions = {
    ["reopen"]: { emoji: "🔓", text: "Reopen" },
    ["transcript"]: { emoji: "📄", text: "Transcript" },
    ["delete"]: { emoji: "🚫", text: "Delete" },
}

function switchChannelState(interaction) {
    let channel = interaction.channel
    let channelName = channel.name

    if (channelName.indexOf("closed") !== -1) {
        channelName = channelName.replace("closed", "open")
    } else if (channelName.indexOf("open") !== -1) {
        channelName = channelName.replace("open", "closed")
    }

    channel.setName(channelName)
}

function changeChannelPermissions(channel, state) {
    try {
        const permissionOverwrites = channel.permissionOverwrites.cache;

        for (const [id, permission] of permissionOverwrites) {
            if (permission.type == OverwriteType.Member) {
                channel.permissionOverwrites.edit(id, {
                    [PermissionFlagsBits.ViewChannel]: state,
                });
            }
        }

    } catch (error) {
        console.error(error);
    }
}

async function closeTicket(interaction) {
    await interaction.message.edit({ components: [] })

    let channel = interaction.channel

    switchChannelState(interaction)

    let description = (
        `# Ticket Closed :lock:
        The ticket was closed successfully. :x:
        
        **Possible actions:**`
    )

    const row = new ActionRowBuilder()

    for (const type in possibleActions) {
        let data = possibleActions[type]
        description =
            `${description}
                > - ${data.emoji} | ${data.text}`

        const button = new ButtonBuilder()
            .setCustomId(`ticket_buttons::${type}`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(data.emoji);

        row.addComponents(button)
    }

    const embed = getEmbedBase()
        .setDescription(description)
        .addFields({
            name: 'Closer-Discord-ID:',
            value: `\`${interaction.user.id}\``,
            inline: true
        }, {
            name: 'Close-Timestamp:',
            value: `\`${getTime()}\``,
            inline: true
        });


    await interaction.reply({ embeds: [embed], components: [row] })
}

async function reopenTicket(interaction) {
    await interaction.message.edit({ components: [] })

    let channel = interaction.channel

    switchChannelState(interaction)

    let embed = getEmbedBase()
        .setDescription(
            `# Ticket reopened :unlock:
            The ticket was successfully reopened. :white_check_mark:`
        )
        .addFields({
            name: 'Reopener-Discord-ID:',
            value: `\`${interaction.user.id}\``,
            inline: true
        }, {
            name: 'Reopened-Timestamp:',
            value: `\`${getTime()}\``,
            inline: true
        });

    await interaction.reply({ embeds: [embed], components: [closeRow] })
}

function deleteTicket(interaction) {
    const embed = getEmbedBase()
        .setDescription(
            `# Ticket deletion:
            The ticket will be deleted at any moment.. :hammer:`
        )

    interaction.reply({ embeds: [embed] })

    setTimeout(() => {
        try {
            interaction.channel.delete()
        } catch (err) {
            console.error(err)
        }
    }, 2500);
}

fs.readFile('transcripts.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    try {
        data = JSON.parse(data)
    } catch (err) { return console.error(err) }

    cachedTickets = Object.assign({}, cachedTickets, data)
});

async function getTicketData(channel) {
    let channelId = channel.id

    if (cachedTickets[channelId].ticketInfo === undefined) {
        return {}
    }

    return cachedTickets[channelId].ticketInfo
}

async function getSavedMessages(channel) {
    let channelId = channel.id
    let collectedMessages = new Collection()

    if (!cachedTickets[channelId]) return false;
    if (!cachedTickets[channelId].messages) return false;

    for (const id in cachedTickets[channelId].messages) {
        const msgId = id

        if (msgId) {
            let message = await channel.messages.fetch(
                cachedTickets[channelId].messages[msgId]
            )

            collectedMessages.set(String(msgId), message);
        }
    }

    return collectedMessages
}

const discordTranscripts = require('discord-html-transcripts');

async function transcriptTicket(interaction) {
    await interaction.reply({ content: ":pushpin: Collecting messages, please wait.." })

    const messages = await getSavedMessages(interaction.channel)

    if (!messages) {
        await interaction.editReply(":x: An error occurred while collecting the messages for the ticket.")
    } else {
        await interaction.editReply({ content: ":hammer: The transcript is being saved, please wait.." })

        let attachment = await discordTranscripts.generateFromMessages(messages, interaction.channel, {
            limit: -1,
            returnType: 'attachment',
            filename: 'transcript.html',
            saveImages: false,
            footerText: `Exported {number} message{s} | ${getTime()} | Project Lyxos by zImSkillz`,
            poweredBy: false,
            hydrate: true
        });

        let transcriptLogChannel = process.env.DISCORD_TRANSCRIPT_CHANNEL

        await interaction.editReply({
            content: `:white_check_mark: Transcript Saved! Find it in the Transcript-Log Channel. <#${transcriptLogChannel}>`,
        })

        const ticketData = JSON.stringify(await getTicketData(interaction.channel), null, 4) || "{}"
        const channel = interaction.guild.channels.cache.get(transcriptLogChannel)
        let embed = getEmbedBase()
            .setDescription(`# Transcript Log`)
            .addFields({
                name: 'Ticket Data:',
                value: '```json\n' + ticketData + '\n```',
                inline: true
            })

        channel.send({
            embeds: [embed],
            files: [attachment]
        })
    }
}

addInteraction("ticket_buttons", async function(interaction, type) {
    if (type == "close") {
        changeChannelPermissions(interaction.channel, false)

        closeTicket(interaction)
    } else if (type == "reopen") {
        changeChannelPermissions(interaction.channel, true)

        reopenTicket(interaction)
    } else if (type == "delete") {
        deleteTicket(interaction)
    } else if (type == "transcript") {
        transcriptTicket(interaction)
    }
})