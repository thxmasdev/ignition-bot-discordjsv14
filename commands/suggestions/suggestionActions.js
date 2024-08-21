const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Manage suggestions')
        .addSubcommand(subcommand =>
            subcommand
                .setName('accept')
                .setDescription('Accept a suggestion')
                .addStringOption(option => 
                    option.setName('messageid')
                    .setDescription('The ID of the suggestion message')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('deny')
                .setDescription('Deny a suggestion')
                .addStringOption(option => 
                    option.setName('messageid')
                    .setDescription('The ID of the suggestion message')
                    .setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const messageId = interaction.options.getString('messageid');
        const suggestionsChannel = interaction.guild.channels.cache.get(config.suggestionsChannelId);

        if (!suggestionsChannel) {
            return interaction.reply({ content: 'Suggestions channel not found.', ephemeral: true });
        }

        const message = await suggestionsChannel.messages.fetch(messageId).catch(() => null);

        if (!message) {
            return interaction.reply({ content: 'Suggestion message not found.', ephemeral: true });
        }

        const embed = EmbedBuilder.from(message.embeds[0]);

        if (subcommand === 'accept') {
            embed.setColor(0x00FF00).setTitle('Accepted Suggestion');
            await message.edit({ embeds: [embed] });
            await interaction.reply({ content: 'Suggestion accepted.', ephemeral: true });
        } else if (subcommand === 'deny') {
            embed.setColor(0xFF0000).setTitle('Denied Suggestion');
            await message.edit({ embeds: [embed] });
            await interaction.reply({ content: 'Suggestion denied.', ephemeral: true });
        }
    },
};
