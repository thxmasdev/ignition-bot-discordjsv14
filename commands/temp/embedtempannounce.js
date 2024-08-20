const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embedtempannounce')
        .setDescription('Embed-Announces a temporary announcement')
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('The channel where the ad will be sent')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
            .setDescription('The title of the announcement')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
            .setDescription('The embed description (use * for new lines)')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('color')
            .setDescription('The color of the embed')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
            .setDescription('Enter the time, example (1m, 2h, 3d)')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('footer')
            .setDescription('The embed footer')
            .setRequired(false))
        .addStringOption(option =>
            option.setName('image')
            .setDescription('The embed image URL')
            .setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have administrator permissions to execute this command.', ephemeral: true });
        }
        
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description').replace(/\*/g, "\n");
        const color = interaction.options.getString('color');
        const footer = interaction.options.getString('footer');
        const image = interaction.options.getString('image');
        const time = interaction.options.getString('time');

        const timeMs = convertToMs(time);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color);

        if (footer) embed.setFooter({ text: footer });
        if (image) embed.setImage(image);

        const announceData = {
            channel: channel.id,
            embed: {
                title: title,
                description: description,
                color: color,
                footer: footer,
                image: image
            },
            time: timeMs,
            date: new Date().toISOString()
        };

        let announces = [];
        if (fs.existsSync('./commands/announcements/jsons/embed-announcements.json')) {
            const data = fs.readFileSync('./commands/announcements/jsons/embed-announcements.json');
            announces = JSON.parse(data);
        }

        announces.push(announceData);

        fs.writeFileSync('./commands/announcements/jsons/embed-announcements.json', JSON.stringify(announces, null, 2));

        await interaction.reply({ content: `Embed-Announce scheduled in ${channel} to be sent in ${time}`, ephemeral: true });

        setTimeout(async () => {
            await channel.send({ embeds: [embed] });
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
            throw new Error('Invalid time');
    }
}
