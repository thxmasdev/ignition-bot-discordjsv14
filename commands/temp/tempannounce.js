const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempannounce')
        .setDescription('Announces a temporary announcement')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where the ad will be sent')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Enter the time, example ( 1m, 2h, 3d )')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have administrator permissions to execute this command.', ephemeral: true });
        }
        
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message').replace(/\*/g, '\n');
        const time = interaction.options.getString('time');

        const timeMs = convertToMs(time);

        const announceData = {
            channel: channel.id,
            message: message,
            time: timeMs,
            date: new Date().toISOString()
        }

        let announces = [];
        if (fs.existsSync('./commands/announcements/jsons/announces.json')) {
            const data = fs.readFileSync('./commands/announcements/jsons/announces.json');
            announces = JSON.parse(data);
        }

        announces.push(announceData)

        fs.writeFileSync('./commands/announcements/jsons/announces.json', JSON.stringify(announces, null, 2));

        await interaction.reply({ content: `Announce scheduled in ${channel} to be sent in ${time}`, ephemeral: true });

        setTimeout(async () => {
            await channel.send(message);
        }, timeMs);
    },

};


function convertToMs(time) {
    const timeValue = parseInt(time.slice(0, -1));
    const timeUnit = time.slice(-1);

    switch (timeUnit) {
        case 's':
            return timeValue * 1000;
        case 'm':
            return timeValue * 60 * 1000;
        case 'h':
            return timeValue * 60 * 60 * 1000;
        case 'd':
            return timeValue * 24 * 60 * 60 * 1000;
        default:
            throw new Error('Invaild time');
    }
}