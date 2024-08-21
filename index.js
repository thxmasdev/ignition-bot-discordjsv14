/*
*
*   Project: Ignition BOT
*   Developer: Thomàs
*   Contributors Ideas: TimeUnit
*   Date: 20/08/2024
*
*/

const { Client, GatewayIntentBits, Partials, Collection, REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ],
});

client.commands = new Collection();

const loadCommands = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            loadCommands(path.join(dir, file.name));
        } else if (file.name.endsWith(".js")) {
            const command = require(path.join(dir, file.name));
            client.commands.set(command.data.name, command);
        }
    }
}

loadCommands(path.join(__dirname, 'commands'));

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('\x1b[31mInitiating the slash command update...\x1b[0m');

        await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
            body: client.commands.map(command => command.data.toJSON()),
        });

        console.log('\x1b[32mUpdated slash commands.\x1b[0m');
    } catch (error) {
        console.error(error);
    }
})();

const activities = [
    { name: 'https://github.com/thxmasdev', type: ActivityType.Playing },
    { name: 'https://github.com/thxmasdev', type: ActivityType.Watching },
    { name: 'https://github.com/thxmasdev', type: ActivityType.Competing },
];

let activityIndex = 0;

function updateActivity() {
    const activity = activities[activityIndex];
    client.user.setPresence({
        status: 'online',
        activities: [activity],
    });

    activityIndex = (activityIndex + 1) % activities.length;
}

client.once('ready', () => {
    updateActivity();
    setInterval(updateActivity, 10000);
});

client.login(config.token);
