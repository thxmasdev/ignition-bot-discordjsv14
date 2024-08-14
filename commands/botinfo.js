const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Displays basic information about the bot.'),

    async execute(interaction) {

        const botAvatarURL = interaction.client.user.displayAvatarURL();

        const embed = {
            color: 0x6E0177,
            title: 'Bot Information',
            description: `This is **${interaction.client.user.username}** a discord bot to manage suggestions on your discord server `,
            fields: [
                {
                    name: '🤖 Bot Name',
                    value: `${interaction.client.user.username}`,
                    inline: true,
                },
                {
                    name: '🔧 Developer',
                    value: '<@!615360256922484757>',
                    inline: true,
                },
                {
                    name: '🏷️ Version',
                    value: 'Beta',
                    inline: true,
                },
                {
                    name: '🔗 Links',
                    value: `**Discord XCode Developers Community**: [Join Here](https://discord.gg/87dDPQaQxP)\n**GitHub**: [thxmasdev](https://github.com/thxmasdev)\n**X**: [thxmasdev](https://x.com/thxmasdev)`,
                    inline: false,
                },
            ],
            footer: {
                text: `Developed by thxmasdev`, iconURL: botAvatarURL
            },
        };

        await interaction.reply({ embeds: [embed] });
    },
};
