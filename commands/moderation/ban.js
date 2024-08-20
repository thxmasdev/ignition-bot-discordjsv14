const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have administrator permissions to execute this command.', ephemeral: true });
        }
        
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const staff = interaction.user;

        const member = await interaction.guild.members.fetch(target.id);
        if (member) {
            try {
                await member.ban({ reason });

                const botAvatarURL = interaction.client.user.displayAvatarURL();

                const embedban = new EmbedBuilder()
                    .setTitle('Moderation')
                    .setColor(0xFA0000)
                    .addFields(
                        {
                            name: 'Action',
                            value: 'Ban',
                            inline: false
                        },
                        {
                            name: 'User',
                            value: target.tag,
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
                    .setFooter({ text: 'Developed by thxmasdev', iconURL: botAvatarURL })
                    .setThumbnail(client.user.displayAvatarURL());

                await interaction.reply({ embeds: [embedban] });
            } catch (error) {
                if (error.code === 50013) {
                    await interaction.reply({ content: 'I do not have permission to ban this member.', ephemeral: true });
                } else {
                    console.error(error);
                    await interaction.reply({ content: 'An error occurred while trying to ban the member.', ephemeral: true });
                }
            }
        } else {
            await interaction.reply({ content: 'Member not found.', ephemeral: true });
        }
    },
};