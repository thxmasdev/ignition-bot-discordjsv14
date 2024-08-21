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
        .setName('unwarn')
        .setDescription('Remove a warning from a user')
        .addUserOption(option => option.setName('user').setDescription('The user to unwarn').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to unwarn users.', ephemeral: true });
        }

        const warns = readWarns();
        if (!warns[user.id] || warns[user.id].length === 0) {
            return interaction.reply(`${user.tag} has no warnings.`);
        }
        warns[user.id].pop();
        writeWarns(warns);

        const embedUnwarn = new EmbedBuilder()
            .setTitle('Warning Removed')
            .setDescription(`A warning has been removed from ${user.tag}.`)
            .setColor(0x00FF00)
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setThumbnail(interaction.client.user.displayAvatarURL());

        await interaction.reply({ embeds: [embedUnwarn] });
    },
};
