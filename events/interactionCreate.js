const { Events, InteractionType } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    execute: async(interaction) => {
        let client = interaction.client;

        if (interaction.type == InteractionType.ApplicationCommand) {
            if (interaction.user.bot) return;
            try {
                const command = client.commands.get(interaction.commandName)

				if(command.run !== undefined) {
					await command.run(client, interaction)
				}

				if(command.execute !== undefined) {
					await command.execute(interaction);
				}
                
            } catch (e) {
                console.error(e)
                interaction.reply({ content: "A problem was encountered while running the command! Please try again.", ephemeral: true })
            }
        }
    }
}