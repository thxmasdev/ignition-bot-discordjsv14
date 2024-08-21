const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

const warnsFilePath = path.join(__dirname, 'jsons', 'warns.json');

function readWarns() {
    if (!fs.existsSync(warnsFilePath)) {
        fs.writeFileSync(warnsFilePath, JSON.stringify({}));
    }
    
    const data = fs.readFileSync(warnsFilePath);
    return JSON.parse(data);
}

function writeWarns(data) {
    fs.writeFileSync(warnsFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('The user to warn')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('Reason for the warning')
            .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to warn users.', ephemeral: true });
        }

        const warns = readWarns();
        if (!warns[user.id]) {
            warns[user.id] = [];
        }

        warns[user.id].push({ reason, date: new Date().toISOString() });
        writeWarns(warns);

        const embedWarn = new EmbedBuilder()
            .setTitle('Moderation')
            .setColor(0xFE9900)
            .addFields(
                {
                    name: 'Action',
                    value: 'Warn',
                    inline: false
                },
                {
                    name: 'User',
                    value: user.tag,
                    inline: false
                },
                {
                    name: 'Staff',
                    value: interaction.user.tag,
                    inline: false
                },
                {
                    name: 'Reason',
                    value: reason,
                    inline: false
                }
            )
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setThumbnail(interaction.client.user.displayAvatarURL());

        await interaction.reply({ embeds: [embedWarn] });

        try {
            const embedDM = new EmbedBuilder()
                .setTitle('Moderation')
                .setDescription(`You were warned by the staff **${interaction.user.tag}**`)
                .setColor(0xFE9900)
                .addFields(
                    {
                        name: 'Action',
                        value: 'Warn',
                        inline: false
                    },
                    {
                        name: 'Reason',
                        value: reason,
                        inline: false
                    }
                )
                .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                .setThumbnail(interaction.client.user.displayAvatarURL());

            await user.send({ embeds: [embedDM] });
        } catch (error) {
            console.error(`Could not send DM to ${user.tag}:`, error);
        }
    },
};
