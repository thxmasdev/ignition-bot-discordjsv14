const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config.json');

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Manage suggestions')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new suggestion')
                .addStringOption(option =>
                    option.setName('suggestion')
                        .setDescription('The suggestion to submit')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('accept')
                .setDescription('Accept a suggestion')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ID of the suggestion message')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('deny')
                .setDescription('Deny a suggestion')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ID of the suggestion message')
                        .setRequired(true))),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const userId = interaction.user.id;
            const now = Date.now();
            const cooldownAmount = 30 * 60 * 1000; // Cooldown time
            if (cooldowns.has(userId)) {
                const expirationTime = cooldowns.get(userId) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({ content: `Please wait ${Math.ceil(timeLeft / 60)} minutes before sending another suggestion.`, ephemeral: true });
                }
            }
            cooldowns.set(userId, now);
            setTimeout(() => cooldowns.delete(userId), cooldownAmount);

            const suggestion = interaction.options.getString('suggestion');
            const channel = client.channels.cache.get(config.channelId);

            if (!channel) {
                return interaction.reply({ content: 'Cannot find the channel ID or the suggestion system is not configured.', ephemeral: true });
            }

            const botAvatarURL = interaction.client.user.displayAvatarURL();

            const embed = new EmbedBuilder()
                .setColor('#6E0177')
                .setTitle('New Suggestion!')
                .setDescription(suggestion)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setFooter({ text: `Developed by thxmasdev`, iconURL: botAvatarURL });

            const message = await channel.send({ embeds: [embed] });
            await message.react('👍');
            await message.react('👎');

            return interaction.reply('Suggestion submitted.');

        } else if (subcommand === 'accept' || subcommand === 'deny') {
            const messageId = interaction.options.getString('message_id');
            const channel = client.channels.cache.get(config.channelId);

            if (!channel) {
                return interaction.reply({ content: 'Cannot find the message ID.', ephemeral: true });
            }

            try {
                const message = await channel.messages.fetch(messageId);
                const oldEmbed = message.embeds[0];

                const embed = new EmbedBuilder()
                    .setColor(oldEmbed.color)
                    .setDescription(oldEmbed.description)
                    .setAuthor({
                        name: oldEmbed.author.name,
                        iconURL: oldEmbed.author.iconURL
                    })
                    .setFooter({ text: oldEmbed.footer.text });

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: 'You do not have administrator permissions to execute this command.', ephemeral: true });
                } // This piece of code is to ensure that only admins can execute the accept/deny subcommands, but anyone can create a suggestion using /suggest create <suggestion>

                if (subcommand === 'accept') {
                    embed.setTitle('Suggestion Accepted')
                        .setColor('#00ff00');

                    await message.reactions.removeAll(); // Remove all reactions.

                    await message.react('❤'); // Add a reaction emoji to the accepted suggestion embed.

                } else if (subcommand === 'deny') {
                    embed.setTitle('Suggestion Denied')
                        .setColor('#ff0000');

                    await message.reactions.removeAll(); // Remove all reactions.

                }

                await message.edit({ embeds: [embed] });

                return interaction.reply({ content: `Suggestion ${subcommand === 'accept' ? 'accepted' : 'denied'}.`, ephemeral: true });

            } catch (error) {
                console.error('Error managing the suggestion:', error);
                return interaction.reply({ content: 'Could not find the suggestion message.', ephemeral: true });
            }
        }
    },
};
