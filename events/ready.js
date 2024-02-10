const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,

	execute(client) {
		client.user.setStatus('dnd');

		let activities = ["https://lyxos.de/", "Lyxos - System", `System: v${sysPackage.version}`];
		
		i = 0;

		setInterval(
			() => client.user.setActivity(
				{
					name: `${activities[i++ % activities.length]}`,
					type: ActivityType.Watching
				}
			), 22000
		);
		
		console.log(`\n======================================================`)
		console.log(`Client is Ready | Logged in as: ${client.user.tag}`)
		console.log(`======================================================\n`)
	},
};