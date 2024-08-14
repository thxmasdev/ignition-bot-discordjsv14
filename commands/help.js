const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands categorized by type'),
    async execute(interaction) {

        const botAvatarURL = interaction.client.user.displayAvatarURL();

        const helpEmbed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setDescription('Here are the available commands categorized by type:')
            .setColor(0x6E0177)

            .addFields(
                { name: 'General Commands', value: '`/botinfo` - Get information about of the bot\n`/help` - Displays this help menu' },

                { name: 'Suggestion Commands', value: '`/suggest create <your suggestion>` - Create a new suggestion\n`/suggest accept <suggestion ID>` - Accept a suggestion\n`/suggest deny <suggestion ID>` - Deny a suggestion' }
            )

            .setFooter({ text: `Developed by thxmasdev`, iconURL: botAvatarURL });

        await interaction.reply({ embeds: [helpEmbed] });
    },
};
