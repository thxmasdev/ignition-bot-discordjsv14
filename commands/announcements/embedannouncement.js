const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embedannounce')
        .setDescription('Send ads in the embed format')
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

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color);

        if (footer) embed.setFooter({ text: footer });
        if (image) embed.setImage(image);

        await interaction.reply({ content: `Embed Ad sent to the cannel ${channel}`, ephemeral: true });

        await channel.send({ embeds: [embed] });
    },
};