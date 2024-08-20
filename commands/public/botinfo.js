const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Displays basic information about the bot.'),

    async execute(interaction, client) {

        const botAvatarURL = interaction.client.user.displayAvatarURL();

        const BotInfo = new EmbedBuilder()
            .setTitle('Bot Information')
            .setDescription(`This is **${interaction.client.user.username}**, a discord bot with various functions, made by thxmasdev`)
            .setColor(0xD43132)
            
            .addFields(
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
                    value: '1.0',
                    inline: false,
                },
                {
                    name: '🔗 Links',
                    value: '**Discord XCode Developers Community**: [Join Here](https://discord.gg/87dDPQaQxP)\n**GitHub**: [thxmasdev](https://github.com/thxmasdev)\n**X | Twitter**: [thxmasdev](https://x.com/thxmasdev)',
                    inline: false,
                },
            )

            .setFooter({ text: 'Developed by thxmasdev', iconURL: botAvatarURL })
            .setThumbnail(client.user.displayAvatarURL());

        await interaction.reply({ embeds: [BotInfo] });
    },
};
