const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send ads')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where the ad will be sent')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have administrator permissions to execute this command.', ephemeral: true });
        }
        
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message').replace(/\*/g, '\n');

        await interaction.reply({ content: `Ad sent to channel ${channel}`, ephemeral: true });

        await channel.send(message);

    },

};