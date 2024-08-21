const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

const autorolesFilePath = path.join(__dirname, 'jsons', 'autoroles.json');

function readAutoroles() {
    if (!fs.existsSync(autorolesFilePath)) {
        fs.writeFileSync(autorolesFilePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(autorolesFilePath);
    return JSON.parse(data);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoroles-send')
        .setDescription('Send an autorole embed')
        .addStringOption(option => 
            option.setName('category')
            .setDescription('The name of the category')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
            .setDescription('The description of the embed')
            .setRequired(true))
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('The channel to send the embed to')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('color')
            .setDescription('The color of the embed')
            .setRequired(false)),

    async execute(interaction) {
        const category = interaction.options.getString('category');
        const description = interaction.options.getString('description').replace(/\*/g, '\n');
        const channel = interaction.options.getChannel('channel');
        const color = interaction.options.getString('color') || '#FFA500';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to send autorole embeds.', ephemeral: true });
        }

        const autoroles = readAutoroles();

        if (!autoroles[category]) {
            return interaction.reply({ content: `Category **${category}** does not exist.`, ephemeral: true });
        }

        let rolesDescription = '';
        autoroles[category].forEach(roleData => {
            const role = interaction.guild.roles.cache.get(roleData.role);
            rolesDescription += `${roleData.emoji} <@&${roleData.role}>\n`;
        });

        const embed = new EmbedBuilder()
            .setTitle(`Reaction Roles - ${category}`)
            .setDescription(`${description}\n\n${rolesDescription}`)
            .setColor(color)
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setThumbnail(interaction.client.user.displayAvatarURL());

        const rows = [];
        let row = new ActionRowBuilder();

        autoroles[category].forEach((roleData, index) => {
            if (index > 0 && index % 5 === 0) {
                rows.push(row);
                row = new ActionRowBuilder();
            }
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`autorole-${category}-${roleData.role}`)
                    .setLabel(roleData.emoji)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        if (row.components.length > 0) {
            rows.push(row);
        }

        await channel.send({ embeds: [embed], components: rows });
        await interaction.reply({ content: `Autorole embed for category **${category}** has been sent to ${channel}.`, ephemeral: true });
    },
};
