const { Events, InteractionType, Collection } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    execute: async(interaction) => {
        let client = interaction.client;

        if (interaction.type == InteractionType.ApplicationCommand) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            if (interaction.user.bot) return;

            const { cooldowns } = interaction.client;

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);

            let cooldown = 1

            if (typeof(command.cooldown) == "number") {
                cooldown = command.cooldown
            }

            const cooldownAmount = cooldown * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);

                    return interaction.reply({ content: `Please wait, you are on a cooldown for \`/${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                if (command.run !== undefined) {
                    await command.run(client, interaction)
                }

                if (command.execute !== undefined) {
                    await command.execute(interaction);
                }

            } catch (e) {
                console.error(e)
                interaction.reply({ content: "A problem was encountered while running the command! Please try again.", ephemeral: true })
            }
        }
    }
}