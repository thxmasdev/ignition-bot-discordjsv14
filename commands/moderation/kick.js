const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require(`../../config.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking')
                .setRequired(false)),


    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have administrator permissions to execute this command.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason privided';
        const staff = interaction.user;

        const member = interaction.guild.members.cache.get(target.id);
        if (member) {
            try {
                await member.kick(reason);

                const embedkick = new EmbedBuilder()
                    .setTitle('Moderation')
                    .setColor(0xFAE900)
                    .addFields(
                        {
                            name: 'Action',
                            value: 'Kick',
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
                    .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                    .setThumbnail(client.user.displayAvatarURL());

                await interaction.reply({ embeds: [embedkick] });
            } catch (error) {
                if (error.code === 50013) {
                    await interaction.reply({ content: 'I do not have permission to kick this member.', ephemeral: true });
                } else {
                    console.error(error);
                    await interaction.reply({ content: 'An error occurred while trying to kick the member.', ephemeral: true });
                }
            }
        } else {
            await interaction.reply({ content: 'Member not found.', ephemeral: true });
        }
    },
};