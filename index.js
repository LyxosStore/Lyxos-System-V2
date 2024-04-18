// Require necessary classes/"scripts"

const { REST, Routes, Client, Collection, Partials, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

https = require('https');
os = require('os')
translatte = require('translatte');

helpMessageList = JSON.parse("{}")
errorCodeList = JSON.parse("{}")

cachedScripts = []

claimedAssets = JSON.parse("{}")

require('dotenv').config()

sysPackage = require('./package.json');

// Functions
sleep = function(sleepTime) {
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}

getSystemUsage = function() {
    let cpuUsage
    let ramUsage

    let cores = os.cpus();

    let totalTime = cores.reduce((total, cpu) => {
        let times = cpu.times;
        return total + times.user + times.nice + times.sys + times.idle + times.irq;
    }, 0);

    let idleTime = cores.reduce((total, cpu) => {
        return total + cpu.times.idle;
    }, 0);

    cpuUsage = (
        (totalTime - idleTime) / totalTime
    ) * 100;

    ramUsage = (
        (os.totalmem() - os.freemem()) / os.totalmem()
    ) * 100;

    cpuUsage = cpuUsage.toFixed(2)
    ramUsage = ramUsage.toFixed(2)

    return [cpuUsage, ramUsage];
}

createProgressBar = function(percentage) {
    const filledBarLength = Math.round((percentage / 100) * 10);
    const emptyBarLength = 10 - filledBarLength;
    const filledBar = '█'.repeat(filledBarLength);
    const emptyBar = '░'.repeat(emptyBarLength);

    return `${filledBar}${emptyBar} ${percentage}%`;
}

getScript = function(script) {
    let foundScript = []

    for (var i in cachedScripts) {
        if (cachedScripts[i].script == script) {
            foundScript = cachedScripts[i]
        }
    }

    return foundScript
}

// Intervals
setInterval(function() {
    console.log("Getting Error & Help Messages..")

    https.get('https://api.cloudassets.eu/geterrorcodes', res => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                if (!data) {
                    return
                }

                errorCodeList = JSON.parse(data)
            } catch (error) {}
        });

    }).on('error', err => {
        console.log('Error while getting error codes: ', err.message);
    });

    https.get('https://api.cloudassets.eu/gethelpmessages', res => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                if (!data) {
                    return
                }

                helpMessageList = JSON.parse(data)
            } catch (error) {}
        });

    }).on('error', err => {
        console.log('Error while getting help messages: ', err.message);
    });
}, 20000)

// Getting Claimed Assets & Scripts
setInterval(function() {
    sql.query("SELECT * FROM scripts", function(err, result, fields) {
        if (err) throw err;

        cachedScripts = result
    });

    sql.query("SELECT * FROM userClaimedData", function(err, result, fields) {
        if (err) throw err;

        claimedAssets = result
    });
}, 5000)

// Creating Client
client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    shards: "auto",
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

// Command Cooldowns
client.cooldowns = new Collection();

// Manager Register
const managerPath = path.join(__dirname, 'manager');
const managerFolders = fs.readdirSync(managerPath);

for (const folder of managerFolders) {
    const commandsPath = path.join(managerPath, folder);
    const filePath = path.join(commandsPath, 'manager.js');

    console.log(`[Manager] [INFO] | Loading Manager: => ${folder}`)

    if (require(filePath)) {
        console.log(`[Manager] [SUCCESS] | ${folder} => has been loaded. \n`)
    } else {
        console.log(`[Manager] [WARNING] | ${folder} => could not be loaded! \n`)
    }
}

// Command Register / Command Handler
client.commands = new Collection() // For Commad Handler
commandsToRegister = [] // For Rest API

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command) {
            client.commands.set(command.data.name, command);
            commandsToRegister.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Event Register / Event Handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Creating Rest
const rest = new REST().setToken(process.env.TOKEN);

// Command Register
(async() => {
    try {
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), { body: commandsToRegister },
        );
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

// Client Login
client.login(process.env.TOKEN);