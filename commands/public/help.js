const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands categorized by type'),
    async execute(interaction, client) {
        const mainEmbed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setDescription('Select a section from the drop-down menu to see different command sections:')
            .setColor(0xDA3132)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setTimestamp(new Date());

        const generalEmbed = new EmbedBuilder()
            .setTitle('General Commands')
            .setDescription('`/botinfo` - Get information about the bot\n`/help` - Displays this help menu')
            .setColor(0xDA3132)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setTimestamp(new Date());

        const tempAnnouncementsEmbed = new EmbedBuilder()
            .setTitle('Temp-Announcements')
            .setDescription('`/embedtempannounce` - Submit an ad in scheduled embed format\n`/tempannounce` - Submit a scheduled announcement')
            .setColor(0xDA3132)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setTimestamp(new Date());

        const moderationEmbed = new EmbedBuilder()
            .setTitle('Moderation Commands')
            .setDescription('`/ban <user> <reason>` - Bans a user from the server\n`/kick <user> <reason>` - Kicks a user from the server\n`/purge <amount> [user]` - Deletes a specified number of messages in the current channel. If a user is specified, deletes messages only from that user\n`/unban <userid> <reason>` - Unbans a user from the server\n`/warn <user> [reason]` - Warns a user\n`/unwarn <user>` - Removes a warning from a user\n`/warnlist <user>` - Lists all warnings for a user')
            .setColor(0xDA3132)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setTimestamp(new Date());

        const autorolesEmbed = new EmbedBuilder()
            .setTitle('Autoroles Commands')
            .setDescription('`/autoroles-create <category>` - Creates a new autorole category\n`/autoroles-add <category> <role> <emoji>` - Adds a role with an emoji to a category\n`/autoroles-remove <category> <role>` - Removes a role from a category\n`/autoroles-send <category> <description> <#channel> [color]` - Sends an autorole embed to a specified channel\n`/autoroles-categories [category]` - Lists all autorole categories or shows details of a specific category')
            .setColor(0xDA3132)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setTimestamp(new Date());

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help-menu')
                .setPlaceholder('Selecciona una sección')
                .addOptions(
                    new StringSelectMenuOptionBuilder({
                        label: 'General Commands',
                        description: 'Commands for general bot information',
                        value: 'general',
                        emoji: '📜',
                    }),
                    new StringSelectMenuOptionBuilder({
                        label: 'Temp-Announcements',
                        description: 'Commands for temporary announcements',
                        value: 'temp-announcements',
                        emoji: '📅',
                    }),
                    new StringSelectMenuOptionBuilder({
                        label: 'Moderation Commands',
                        description: 'Commands for server moderation',
                        value: 'moderation',
                        emoji: '⚔',
                    }),
                    new StringSelectMenuOptionBuilder({
                        label: 'Autoroles Commands',
                        description: 'Commands for managing autoroles',
                        value: 'autoroles',
                        emoji: '🔧',
                    })
                )
        );

        await interaction.reply({ embeds: [mainEmbed], components: [selectMenu], ephemeral: true });

        const filter = i => i.customId === 'help-menu' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.values[0] === 'general') {
                await i.deferUpdate();
                await i.editReply({ embeds: [generalEmbed], components: [selectMenu], ephemeral: true });
            } else if (i.values[0] === 'temp-announcements') {
                await i.deferUpdate();
                await i.editReply({ embeds: [tempAnnouncementsEmbed], components: [selectMenu], ephemeral: true });
            } else if (i.values[0] === 'moderation') {
                await i.deferUpdate();
                await i.editReply({ embeds: [moderationEmbed], components: [selectMenu], ephemeral: true });
            } else if (i.values[0] === 'autoroles') {
                await i.deferUpdate();
                await i.editReply({ embeds: [autorolesEmbed], components: [selectMenu], ephemeral: true });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] });
            }
        });
    },
};
