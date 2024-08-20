const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified number of messages in the current channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of messages to delete.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Optional: Deletes messages only from this user.')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have administrator permissions to execute this command.', ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');
        const user = interaction.options.getUser('user');
        const staff = interaction.user;

        if (amount <= 0 || amount > 100) {
            return interaction.reply({ content: 'The number of messages must be between 1 and 100.', ephemeral: true });
        }

        try {
            let messages;
            if (user) {
                messages = await interaction.channel.messages.fetch({ limit: 100 });
                messages = messages.filter(msg => msg.author.id === user.id).first(amount);
                await interaction.channel.bulkDelete(messages, true);
            } else {
                messages = await interaction.channel.messages.fetch({ limit: amount });
                await interaction.channel.bulkDelete(messages, true);
            }

            const botAvatarURL = interaction.client.user.displayAvatarURL();

            const embedpurge = new EmbedBuilder()
                .setTitle('Moderation')
                .setColor(0x26FF05)
                .addFields(
                    {
                        name: 'Action',
                        value: 'Purge',
                        inline: false
                    },
                    {
                        name: 'Amount',
                        value: `${amount} messages`,
                        inline: false
                    },
                    {
                        name: 'Staff',
                        value: staff.tag,
                        inline: false
                    }
                )
                .setFooter({ text: 'Developed by thxmasdev', iconURL: botAvatarURL })
                .setThumbnail(client.user.displayAvatarURL());

            if (user) {
                embedpurge.addFields({
                    name: 'User',
                    value: user.tag,
                    inline: false
                });
            }

            await interaction.reply({ embeds: [embedpurge] });

        } catch (error) {
            if (error.code === 50013) {
                await interaction.reply({ content: 'I do not have permissions to delete messages in this channel.', ephemeral: true });
            } else {
                console.error(error);
                await interaction.reply({ content: 'An error occurred while trying to delete messages.', ephemeral: true });
            }
        }
    },
};
