const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");

const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a Giveaway or Configure a Giveaway')
        .addSubcommand(command =>
            command.setName('start')
            .setDescription('Start a giveaway')
            .addStringOption(option =>
                option.setName('duration')
                .setDescription('Duration of the giveaway (Example: 1m, 1d, 1h..)')
                .setRequired(true)
            ).addIntegerOption(option =>
                option.setName('winners')
                .setDescription('Number of winners')
                .setRequired(true)
            ).addStringOption(option =>
                option.setName('prize')
                .setDescription('The Prize for the winners')
                .setRequired(true)
            ).addChannelOption(option =>
                option.setName('channel')
                .setDescription('The channel in which the giveaway starts')
                .setRequired(false)
            ).addStringOption(option =>
                option.setName('content')
                .setDescription('Giveaway content message')
                .setRequired(false)
            ).addRoleOption(option =>
                option.setName('neededrole')
                .setDescription('The role is required for the giveaway')
                .setRequired(false)
            ).addRoleOption(option =>
                option.setName('bonusentriesroleone')
                .setDescription('Enable 2x Bonus Entries for specific Role')
                .setRequired(false)
            ).addRoleOption(option =>
                option.setName('bonusentriesroletwo')
                .setDescription('Enable 2x Bonus Entries for specific Role')
                .setRequired(false)
            )
        ).addSubcommand(command =>
            command.setName('edit')
            .setDescription('Edit a giveaway')
            .addStringOption(option =>
                option.setName('message-id')
                .setDescription('The message-id of the giveaway')
                .setRequired(true)
            ).addStringOption(option =>
                option.setName('time')
                .setDescription('Edit the duration of the giveaway (in ms)')
                .setRequired(true)
            ).addIntegerOption(option =>
                option.setName('winners')
                .setDescription('Edit amount of winners for the giveaway')
                .setRequired(true)
            ).addStringOption(option =>
                option.setName('prize')
                .setDescription('Edit the prize of the giveaway')
                .setRequired(false)
            )
        ).addSubcommand(command =>
            command.setName('end')
            .setDescription('End a giveaway')
            .addStringOption(option =>
                option.setName('message-id')
                .setDescription('The message-id of the giveaway')
                .setRequired(true)
            )
        ).addSubcommand(command =>
            command.setName('pause')
            .setDescription('Pause a giveaway')
            .addStringOption(option =>
                option.setName('message-id')
                .setDescription('The message-id of the giveaway')
                .setRequired(true)
            )
        ).addSubcommand(command =>
            command.setName('unpause')
            .setDescription('Unpause a giveaway')
            .addStringOption(option =>
                option.setName('message-id')
                .setDescription('The message-id of the giveaway')
                .setRequired(true)
            )
        ).addSubcommand(command =>
            command.setName('reroll')
            .setDescription('Reroll a giveaway')
            .addStringOption(option =>
                option.setName('message-id')
                .setDescription('The message-id of the giveaway')
                .setRequired(true)
            )
        ).addSubcommand(command =>
            command.setName('delete')
            .setDescription('Delete a giveaway')
            .addStringOption(option =>
                option.setName('message-id')
                .setDescription('The message-id of the giveaway')
                .setRequired(true)
            )
        ),
    run: async(client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Project Lyxos')
                .setDescription('# Missing permissions:\n\nIn order to be able to execute this command, you are unfortunately missing a few permissions!')
                .setTimestamp()
                .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });
            return await interaction.reply({ embeds: [embed] })
        } else {
            const sub = interaction.options.getSubcommand();

            switch (sub) {
                case 'start':
                    await interaction.reply({ content: `Starting the giveaway.. 🔨`, ephemeral: true })

                    const duration = ms(interaction.options.getString('duration') || "");
                    const winnerCount = interaction.options.getInteger('winners');
                    const prize = interaction.options.getString('prize');
                    const contentmain = interaction.options.getString('content');
                    const channel = interaction.options.getChannel('channel');
                    const showchannel = interaction.options.getChannel('channel') || interaction.channel;
                    const neededrole = interaction.options.getRole('neededrole') || false

                    if (interaction.options.getRole('bonusentriesroleone') !== null) {
                        var bonusEntriesRoleOne = interaction.options.getRole('bonusentriesroleone').id;
                    } else {
                        var bonusEntriesRoleOne = "000000000000000000"
                    }

                    if (interaction.options.getRole('bonusentriesroletwo') !== null) {
                        var bonusEntriesRoleTwo = interaction.options.getRole('bonusentriesroletwo').id;
                    } else {
                        var bonusEntriesRoleTwo = "000000000000000000"
                    }

                    if (!channel && !contentmain) {
                        if (!neededrole) {
                            client.giveawaysManager.start(interaction.channel, {
                                prize,
                                winnerCount,
                                duration,
                                hostedBy: interaction.user,
                                messages: {
                                    giveaway: '🎁🎉 **GIVEAWAY IS OPEN** 🎉🎁',
                                    giveawayEnded: '🎁🎉 **GIVEAWAY HAS ENDED** 🎉🎁',
                                    title: '__Prize:__ ``{this.prize}``',
                                    drawing: 'Drawing Winners: {timestamp}',
                                    dropMessage: 'Be the first to react with 🎉 !',
                                    inviteToParticipate: 'React with 🎉 to participate!',
                                    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\nGiveaway: {this.messageURL}',
                                    embedFooter: 'Project Lyxos by: zImSkillz | [OPEN] | {this.winnerCount} winner(s)',
                                    noWinner: 'Giveaway cancelled, no valid participations.',
                                    hostedBy: 'Giveaway Created by: {this.hostedBy}',
                                    winners: 'Winner(s):',
                                    endedAt: 'Project Lyxos by: zImSkillz | [CLOSED] | Ended at',
                                    infiniteDurationText: '`NEVER`'
                                },
                                lastChance: {
                                    enabled: false,
                                    content: contentmain,
                                    threshold: parseInt('60000000000_000'),
                                    embedColor: '#ff8000',
                                    infiniteDurationText: '`NEVER`'
                                },
                                bonusEntries: [{
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleOne) ? 2 : null),
                                        cumulative: false
                                    },
                                    {
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleTwo) ? 2 : null),
                                        cumulative: false
                                    }
                                ]
                            });
                        } else {
                            client.giveawaysManager.start(interaction.channel, {
                                prize,
                                winnerCount,
                                duration,
                                hostedBy: interaction.user,
                                messages: {
                                    giveaway: '🎁🎉 **GIVEAWAY IS OPEN** 🎉🎁',
                                    giveawayEnded: '🎁🎉 **GIVEAWAY HAS ENDED** 🎉🎁',
                                    title: '__Prize:__ ``{this.prize}``',
                                    drawing: 'Drawing Winners: {timestamp}',
                                    dropMessage: 'Be the first to react with 🎉 !',
                                    inviteToParticipate: 'React with 🎉 to participate!',
                                    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\nGiveaway: {this.messageURL}',
                                    embedFooter: 'Project Lyxos by: zImSkillz | [OPEN] | {this.winnerCount} winner(s)',
                                    noWinner: 'Giveaway cancelled, no valid participations.',
                                    hostedBy: `Giveaway Created by: {this.hostedBy}\n\nRequired Role: <@&${neededrole.id}>`,
                                    winners: 'Winner(s):',
                                    endedAt: 'Project Lyxos by: zImSkillz | [CLOSED] | Ended at',
                                    infiniteDurationText: '`NEVER`'
                                },
                                lastChance: {
                                    enabled: false,
                                    content: contentmain,
                                    threshold: parseInt('60000000000_000'),
                                    embedColor: '#ff8000',
                                    infiniteDurationText: '`NEVER`'
                                },
                                exemptMembers: new Function(
                                    'member',
                                    'giveaway',
                                    `return !member.roles.cache.some((r) => r.id === '${neededrole.id}')`
                                ),
                                bonusEntries: [{
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleOne) ? 2 : null),
                                        cumulative: false
                                    },
                                    {
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleTwo) ? 2 : null),
                                        cumulative: false
                                    }
                                ]
                            });
                        }
                    } else if (!channel) {
                        if (!neededrole) {
                            client.giveawaysManager.start(interaction.channel, {
                                prize,
                                winnerCount,
                                duration,
                                hostedBy: interaction.user,
                                messages: {
                                    giveaway: '🎁🎉 **GIVEAWAY IS OPEN** 🎉🎁',
                                    giveawayEnded: '🎁🎉 **GIVEAWAY HAS ENDED** 🎉🎁',
                                    title: '__Prize:__ ``{this.prize}``',
                                    drawing: 'Drawing Winners: {timestamp}',
                                    dropMessage: 'Be the first to react with 🎉 !',
                                    inviteToParticipate: 'React with 🎉 to participate!',
                                    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\nGiveaway: {this.messageURL}',
                                    embedFooter: 'Project Lyxos by: zImSkillz | [OPEN] | {this.winnerCount} winner(s)',
                                    noWinner: 'Giveaway cancelled, no valid participations.',
                                    hostedBy: 'Giveaway Created by: {this.hostedBy}',
                                    winners: 'Winner(s):',
                                    endedAt: 'Project Lyxos by: zImSkillz | [CLOSED] | Ended at',
                                    infiniteDurationText: '`NEVER`'
                                },
                                lastChance: {
                                    enabled: false,
                                    content: contentmain,
                                    threshold: parseInt('60000000000_000'),
                                    embedColor: '#ff8000',
                                    infiniteDurationText: '`NEVER`'
                                },
                                bonusEntries: [{
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleOne) ? 2 : null),
                                        cumulative: false
                                    },
                                    {
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleTwo) ? 2 : null),
                                        cumulative: false
                                    }
                                ]
                            });
                        } else {
                            client.giveawaysManager.start(interaction.channel, {
                                prize,
                                winnerCount,
                                duration,
                                hostedBy: interaction.user,
                                messages: {
                                    giveaway: '🎁🎉 **GIVEAWAY IS OPEN** 🎉🎁',
                                    giveawayEnded: '🎁🎉 **GIVEAWAY HAS ENDED** 🎉🎁',
                                    title: '__Prize:__ ``{this.prize}``',
                                    drawing: 'Drawing Winners: {timestamp}',
                                    dropMessage: 'Be the first to react with 🎉 !',
                                    inviteToParticipate: 'React with 🎉 to participate!',
                                    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\nGiveaway: {this.messageURL}',
                                    embedFooter: 'Project Lyxos by: zImSkillz | [OPEN] | {this.winnerCount} winner(s)',
                                    noWinner: 'Giveaway cancelled, no valid participations.',
                                    hostedBy: `Giveaway Created by: {this.hostedBy}\n\nRequired Role: <@&${neededrole.id}>`,
                                    winners: 'Winner(s):',
                                    endedAt: 'Project Lyxos by: zImSkillz | [CLOSED] | Ended at',
                                    infiniteDurationText: '`NEVER`'
                                },
                                lastChance: {
                                    enabled: false,
                                    content: contentmain,
                                    threshold: parseInt('60000000000_000'),
                                    embedColor: '#ff8000',
                                    infiniteDurationText: '`NEVER`'
                                },
                                exemptMembers: new Function(
                                    'member',
                                    'giveaway',
                                    `return !member.roles.cache.some((r) => r.id === '${neededrole.id}')`
                                ),
                                bonusEntries: [{
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleOne) ? 2 : null),
                                        cumulative: false
                                    },
                                    {
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleTwo) ? 2 : null),
                                        cumulative: false
                                    }
                                ]
                            });
                        }
                    } else if (!contentmain) {
                        if (!neededrole) {
                            client.giveawaysManager.start(channel, {
                                prize,
                                winnerCount,
                                duration,
                                hostedBy: interaction.user,
                                messages: {
                                    giveaway: '🎁🎉 **GIVEAWAY IS OPEN** 🎉🎁',
                                    giveawayEnded: '🎁🎉 **GIVEAWAY HAS ENDED** 🎉🎁',
                                    title: '__Prize:__ ``{this.prize}``',
                                    drawing: 'Drawing Winners: {timestamp}',
                                    dropMessage: 'Be the first to react with 🎉 !',
                                    inviteToParticipate: 'React with 🎉 to participate!',
                                    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\nGiveaway: {this.messageURL}',
                                    embedFooter: 'Project Lyxos by: zImSkillz | [OPEN] | {this.winnerCount} winner(s)',
                                    noWinner: 'Giveaway cancelled, no valid participations.',
                                    hostedBy: 'Giveaway Created by: {this.hostedBy}',
                                    winners: 'Winner(s):',
                                    endedAt: 'Project Lyxos by: zImSkillz | [CLOSED] | Ended at',
                                    infiniteDurationText: '`NEVER`'
                                },
                                lastChance: {
                                    enabled: false,
                                    content: contentmain,
                                    threshold: parseInt('60000000000_000'),
                                    embedColor: '#ff8000',
                                    infiniteDurationText: '`NEVER`'
                                },
                                bonusEntries: [{
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleOne) ? 2 : null),
                                        cumulative: false
                                    },
                                    {
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleTwo) ? 2 : null),
                                        cumulative: false
                                    }
                                ]
                            });
                        } else {
                            client.giveawaysManager.start(channel, {
                                prize,
                                winnerCount,
                                duration,
                                hostedBy: interaction.user,
                                messages: {
                                    giveaway: '🎁🎉 **GIVEAWAY IS OPEN** 🎉🎁',
                                    giveawayEnded: '🎁🎉 **GIVEAWAY HAS ENDED** 🎉🎁',
                                    title: '__Prize:__ ``{this.prize}``',
                                    drawing: 'Drawing Winners: {timestamp}',
                                    dropMessage: 'Be the first to react with 🎉 !',
                                    inviteToParticipate: 'React with 🎉 to participate!',
                                    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\nGiveaway: {this.messageURL}',
                                    embedFooter: 'Project Lyxos by: zImSkillz | [OPEN] | {this.winnerCount} winner(s)',
                                    noWinner: 'Giveaway cancelled, no valid participations.',
                                    hostedBy: `Giveaway Created by: {this.hostedBy}\n\nRequired Role: <@&${neededrole.id}>`,
                                    winners: 'Winner(s):',
                                    endedAt: 'Project Lyxos by: zImSkillz | [CLOSED] | Ended at',
                                    infiniteDurationText: '`NEVER`'
                                },
                                lastChance: {
                                    enabled: false,
                                    content: contentmain,
                                    threshold: parseInt('60000000000_000'),
                                    embedColor: '#ff8000',
                                    infiniteDurationText: '`NEVER`'
                                },
                                exemptMembers: new Function(
                                    'member',
                                    'giveaway',
                                    `return !member.roles.cache.some((r) => r.id === '${neededrole.id}')`
                                ),
                                bonusEntries: [{
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleOne) ? 2 : null),
                                        cumulative: false
                                    },
                                    {
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleTwo) ? 2 : null),
                                        cumulative: false
                                    }
                                ]
                            });
                        }
                    } else {
                        if (!neededrole) {
                            client.giveawaysManager.start(channel, {
                                prize,
                                winnerCount,
                                duration,
                                hostedBy: interaction.user,
                                messages: {
                                    giveaway: '🎁🎉 **GIVEAWAY IS OPEN** 🎉🎁',
                                    giveawayEnded: '🎁🎉 **GIVEAWAY HAS ENDED** 🎉🎁',
                                    title: '__Prize:__ ``{this.prize}``',
                                    drawing: 'Drawing Winners: {timestamp}',
                                    dropMessage: 'Be the first to react with 🎉 !',
                                    inviteToParticipate: 'React with 🎉 to participate!',
                                    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\nGiveaway: {this.messageURL}',
                                    embedFooter: 'Project Lyxos by: zImSkillz | [OPEN] | {this.winnerCount} winner(s)',
                                    noWinner: 'Giveaway cancelled, no valid participations.',
                                    hostedBy: 'Giveaway Created by: {this.hostedBy}',
                                    winners: 'Winner(s):',
                                    endedAt: 'Project Lyxos by: zImSkillz | [CLOSED] | Ended at',
                                    infiniteDurationText: '`NEVER`'
                                },
                                lastChance: {
                                    enabled: true,
                                    content: contentmain,
                                    threshold: parseInt('60000000000_000'),
                                    embedColor: '#ff8000',
                                    infiniteDurationText: '`NEVER`'
                                },
                                bonusEntries: [{
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleOne) ? 2 : null),
                                        cumulative: false
                                    },
                                    {
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleTwo) ? 2 : null),
                                        cumulative: false
                                    }
                                ]
                            });
                        } else {
                            client.giveawaysManager.start(channel, {
                                prize,
                                winnerCount,
                                duration,
                                hostedBy: interaction.user,
                                messages: {
                                    giveaway: '🎁🎉 **GIVEAWAY IS OPEN** 🎉🎁',
                                    giveawayEnded: '🎁🎉 **GIVEAWAY HAS ENDED** 🎉🎁',
                                    title: '__Prize:__ ``{this.prize}``',
                                    drawing: 'Drawing Winners: {timestamp}',
                                    dropMessage: 'Be the first to react with 🎉 !',
                                    inviteToParticipate: 'React with 🎉 to participate!',
                                    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\nGiveaway: {this.messageURL}',
                                    embedFooter: 'Project Lyxos by: zImSkillz | [OPEN] | {this.winnerCount} winner(s)',
                                    noWinner: 'Giveaway cancelled, no valid participations.',
                                    hostedBy: `Giveaway Created by: {this.hostedBy}\n\nRequired Role: <@&${neededrole.id}>`,
                                    winners: 'Winner(s):',
                                    endedAt: 'Project Lyxos by: zImSkillz | [CLOSED] | Ended at',
                                    infiniteDurationText: '`NEVER`'
                                },
                                lastChance: {
                                    enabled: true,
                                    content: contentmain,
                                    threshold: parseInt('60000000000_000'),
                                    embedColor: '#ff8000',
                                    infiniteDurationText: '`NEVER`'
                                },
                                exemptMembers: new Function(
                                    'member',
                                    'giveaway',
                                    `return !member.roles.cache.some((r) => r.id === '${neededrole.id}')`
                                ),
                                bonusEntries: [{
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleOne) ? 2 : null),
                                        cumulative: false
                                    },
                                    {
                                        bonus: (member, giveaway) => (member.roles.cache.some((r) => r.id === bonusEntriesRoleTwo) ? 2 : null),
                                        cumulative: false
                                    }
                                ]
                            });
                        }
                    }
                    interaction.editReply({ content: `The giveway was created! Find the giveaway here: ${showchannel} ✅`, ephemeral: true });

                    break;
                case 'edit':
                    await interaction.reply({ content: `Editing the giveaway.. 🔨`, ephemeral: true })

                    const newprize = interaction.options.getString('prize')
                    const newduration = interaction.options.getString('time')
                    const newwinners = interaction.options.getInteger('winners')
                    const messageId = interaction.options.getString('message-id')

                    client.giveawaysManager.edit(messageId, {
                        addTime: ms(newduration),
                        newWinnerCount: newwinners,
                        newPrize: newprize
                    }).then(() => {
                        interaction.editReply({ content: `The giveway has been edited! ✅`, ephemeral: true });
                    }).catch(err => {
                        interaction.editReply({ content: `The giveaway could not be edited! ❌`, ephemeral: true });
                    });

                    break;
                case 'end':
                    await interaction.reply({ content: `Ending the giveaway.. 🔨`, ephemeral: true })

                    const messageId1 = interaction.options.getString('message-id');

                    client.giveawaysManager.end(messageId1).then(() => {
                        interaction.editReply({ content: `The giveway has been ended! ✅`, ephemeral: true });
                    }).catch(err => {
                        interaction.editReply({ content: `The giveaway could not be ended! ❌`, ephemeral: true });
                    });

                    break;
                case 'pause':
                    await interaction.reply({ content: `Pausing the giveaway.. 🔨`, ephemeral: true })

                    const messageId2 = interaction.options.getString('message-id');

                    client.giveawaysManager.pause(messageId2, {
                        isPaused: true,
                        content: '⚠️ **GIVEAWAY IS PAUSED** ⚠️',
                        unpauseAfter: null,
                        embedColor: '#FFFF00'
                    }).then(() => {
                        interaction.editReply({ content: `The giveway has been paused! ✅`, ephemeral: true });
                    }).catch(err => {
                        interaction.editReply({ content: `The giveaway could not be paused! ❌`, ephemeral: true });
                    });

                    break;
                case 'unpause':
                    await interaction.reply({ content: `Unpausing the giveaway.. 🔨`, ephemeral: true })

                    const messageId3 = interaction.options.getString('message-id');

                    client.giveawaysManager.unpause(messageId3).then(() => {
                        interaction.editReply({ content: `The giveway has been unpaused! ✅`, ephemeral: true });
                    }).catch(err => {
                        interaction.editReply({ content: `The giveaway could not be unpaused! ❌`, ephemeral: true });
                    });

                    break;
                case 'reroll':
                    await interaction.reply({ content: `Rerolling the giveaway.. 🔨`, ephemeral: true })

                    const query = interaction.options.getString('message-id');
                    const giveaway = client.giveawaysManager.giveaways.find((g) =>
                        g.guildId === interaction.guildId && g.prize === query
                    ) || client.giveawaysManager.giveaways.find((g) =>
                        g.guildId === interaction.guildId && g.messageId === query
                    )

                    if (!giveaway) {
                        interaction.editReply({ content: `The giveaway could not be rerolled! ❌`, ephemeral: true });
                    } else {
                        const messageId2 = interaction.options.getString('message-id');
                        client.giveawaysManager.reroll(messageId2).then(() => {
                            interaction.editReply({ content: `The giveway has been rerolled! ✅`, ephemeral: true });
                        }).catch(err => {
                            interaction.editReply({ content: `The giveaway could not be rerolled! ❌`, ephemeral: true });
                        });
                    }
                case 'delete':
                    await interaction.reply({ content: `Deleting the giveaway.. 🔨`, ephemeral: true })

                    const query2 = interaction.options.getString('message-id');
                    const giveaway2 = client.giveawaysManager.giveaways.find((g) =>
                        g.guildId === interaction.guildId && g.prize === query2
                    ) || client.giveawaysManager.giveaways.find((g) =>
                        g.guildId === interaction.guildId && g.messageId === query2
                    )

                    if (!giveaway2) {
                        interaction.editReply({ content: `The giveaway could not be deleted! ❌`, ephemeral: true });
                    } else {
                        const messageId4 = interaction.options.getString('message-id');
                        client.giveawaysManager.delete(messageId4).then(() => {
                            interaction.editReply({ content: `The giveway has been deleted! ✅`, ephemeral: true });
                        }).catch(err => {
                            interaction.editReply({ content: `The giveaway could not be deleted! ❌`, ephemeral: true });
                        });
                    }
            }
        }
    }
};