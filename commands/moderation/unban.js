const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The ID of the user to unban.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for unbanning the user.')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have administrator permissions to execute this command.', ephemeral: true });
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const staff = interaction.user;

        try {
            await interaction.guild.members.unban(userId, reason);

            const embedUnban = new EmbedBuilder()
                .setTitle('Moderation')
                .setColor(0x26FF05)
                .addFields(
                    {
                        name: 'Action',
                        value: 'Unban',
                        inline: false
                    },
                    {
                        name: 'User ID',
                        value: userId,
                        inline: false
                    },
                    {
                        name: 'Staff',
                        value: staff.tag,
                        inline: false
                    },
                    {
                        name: 'Reason',
                        value: reason,
                        inline: false
                    }
                )
                .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                .setThumbnail(client.user.displayAvatarURL());

            await interaction.reply({ embeds: [embedUnban] });

        } catch (error) {
            if (error.code === 10013) {
                await interaction.reply({ content: 'The user ID provided is not valid or the user is not banned.', ephemeral: true });
            } else {
                console.error(error);
                await interaction.reply({ content: 'An error occurred while trying to unban the user.', ephemeral: true });
            }
        }
    },
};
