const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json')

const autorolesFilePath = path.join(__dirname, '../commands/autorol/jsons/autoroles.json');

function readAutoroles() {
    if (!fs.existsSync(autorolesFilePath)) {
        fs.writeFileSync(autorolesFilePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(autorolesFilePath);
    return JSON.parse(data);
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const [prefix, category, roleId] = interaction.customId.split('-');
        if (prefix !== 'autorole') return;

        const autoroles = readAutoroles();

        if (!autoroles[category]) {
            return interaction.reply({ content: `Category **${category}** does not exist.`, ephemeral: true });
        }

        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) {
            return interaction.reply({ content: `Role with ID **${roleId}** does not exist.`, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Role Update')
            .setColor(interaction.member.roles.cache.has(roleId) ? 0xFF0000 : 0x00FF00)
            .addFields(
                { 
                    name: 'Action', 
                    value: interaction.member.roles.cache.has(roleId) ? 'Role Removed' : 'Role Added', 
                    inline: true 
                },
                { 
                    name: 'Role', 
                    value: role.name, 
                    inline: true 
                }
            )
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setThumbnail(interaction.client.user.displayAvatarURL());

        if (interaction.member.roles.cache.has(roleId)) {
            await interaction.member.roles.remove(role);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.member.roles.add(role);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
