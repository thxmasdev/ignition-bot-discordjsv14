const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands categorized by type'),
    async execute(interaction, client) {

        const botAvatarURL = interaction.client.user.displayAvatarURL();

        const helpEmbed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setDescription('Here are the available commands categorized by type:')
            .setColor(0xDA3132)

            .addFields(
                { 
                    name: 'General Commands', 
                    value: '`/botinfo` - Get information about the bot\n`/help` - Displays this help menu'
                },

                { 
                    name: 'Temp-Announcements', 
                    value: '`/embedtempannounce` - Submit an ad in scheduled embed format\n`/tempannounce` - Submit a scheduled announcement' 
                },
                {
                    name: 'Moderation Commands',
                    value: '`/ban <user> <reason>` - Bans a user from the server\n`/kick <user> <reason>` - Kicks a user from the server\n`/purge <amount> [user]` - Deletes a specified number of messages in the current channel. If a user is specified, deletes messages only from that user\n`/unban <userid> <reason>` - Unbans a user from the server'
                }
            )

            .setFooter({ text: `Developed by thxmasdev`, iconURL: botAvatarURL })
            .setThumbnail(client.user.displayAvatarURL());

        await interaction.reply({ embeds: [helpEmbed] });
    },
};
