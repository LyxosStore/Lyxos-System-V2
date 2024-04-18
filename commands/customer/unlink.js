const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');
const { cooldown } = require("./claim");

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('unlink')
        .setDescription('Unlink a Claimed CFX.RE Asset from your Discord-ID')
        .addStringOption(option =>
            option
            .setName('tebexid')
            .setDescription('The Tebex Transaction ID')
            .setRequired(true)),
    async execute(interaction) {
        let data = false
        let tried = 0
        let ownerOfTransactionId = false
        let transactionId = interaction.options.getString('tebexid')
        let embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Project Lyxos')
            .setDescription(`# Oh, I think this transaction is not yours or it doesn't exist! ❌\n\nAn error occurred while searching for the specific transaction ID. either the transaction does not exist or it is owned by someone else! :x:`)
            .setTimestamp()
            .setFooter({ text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`, iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png' });

        for (var i in claimedAssets) {
            if (claimedAssets[i].transactionId == transactionId && claimedAssets[i].claimer == interaction.user.id) {
                ownerOfTransactionId = true
            }
        }

        if (ownerOfTransactionId) {
            sql.query("DELETE FROM userClaimedData WHERE transactionId = ?", [
                transactionId
            ], async function(error) {
                if (error) {
                    console.error(error)
                } else {
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

                    if (data !== false && String(data) !== "[]" && String(data) !== '') {
                        embed = new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('Project Lyxos')
                            .setDescription(`# Asset Unclaimed! :white_check_mark:\n\n You have successfully unclaimed the asset! :white_check_mark:`)
                            .setTimestamp()
                            .setFooter({
                                text: `Project Lyxos by: zImSkillz | Command Requested by: ${interaction.user.tag}`,
                                iconURL: 'https://cdn.discordapp.com/attachments/950308582665125898/1062356266300743751/lyxos-new.png'
                            });

                        for (var i in claimedAssets) {
                            if (claimedAssets[i].transactionId == transactionId && claimedAssets[i].claimer == interaction.user.id) {
                                claimedAssets[i] = undefined
                            }
                        }

                        // Loop Packages
                        for (var i in data.packages) {
                            // Format Name
                            let package = data.packages[i]
                            let name = package.name // Input: e.g : Lyxos AntiBackdoor [MONTHLY]

                            name = name.replace(/\[.*?\]/g, '');
                            name = name.replace(/Lyxos/g, '');
                            name = name.replace(/\s/g, '');
                            name = name.toLowerCase() // Output: e.g. : antibackdoor

                            // Getting Script & Role
                            try {
                                let script = await getScript(name)
                                let hasRole = interaction.member.roles.cache.some(r => r.name.includes('lyxos') && r.id == script.role)
                                let role = await interaction.guild.roles.cache.find(r => r.name.includes('lyxos') && r.id == script.role);

                                console.log(`Removeing: ${interaction.user.id} | Role: ${script.role || 'err'} | Script: ${name}`)

                                if (hasRole && role !== undefined) {
                                    interaction.member.roles.remove(role);
                                }

                            } catch (err) { console.error(err) }
                        }

                        return interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                }

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            });
        } else {
            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }
    },
};