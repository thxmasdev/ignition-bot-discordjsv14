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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnlist')
        .setDescription('List all warnings for a user')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('The user to list warnings for')
            .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to view warnings.', ephemeral: true });
        }

        const warns = readWarns();
        const userWarns = warns[user.id];

        if (!userWarns || userWarns.length === 0) {
            return interaction.reply(`${user.tag} has no warnings.`);
        }

        const embedWarnList = new EmbedBuilder()
            .setTitle('Warnings List')
            .setColor(0xFFA500)
            .setDescription(`Warnings for ${user.tag}`)
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setThumbnail(interaction.client.user.displayAvatarURL());

        userWarns.forEach((warn, index) => {
            embedWarnList.addFields(
                { name: `Warning ${index + 1}`, value: `**Reason:** ${warn.reason}\n**Date:** ${new Date(warn.date).toLocaleString()}`, inline: false }
            );
        });

        await interaction.reply({ embeds: [embedWarnList] });
    },
};
