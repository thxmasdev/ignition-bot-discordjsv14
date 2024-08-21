const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
        .setName('autoroles-categories')
        .setDescription('List all autorole categories or show details of a specific category')
        .addStringOption(option => 
            option.setName('category')
            .setDescription('The name of the category')
            .setRequired(false)),

    async execute(interaction) {
        const category = interaction.options.getString('category');
        const autoroles = readAutoroles();

        if (category) {
            if (!autoroles[category]) {
                return interaction.reply({ content: `Category **${category}** does not exist.`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle(`Category: ${category}`)
                .setColor('#FFA500')
                .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                .setThumbnail(interaction.client.user.displayAvatarURL());

            autoroles[category].forEach(roleData => {
                const role = interaction.guild.roles.cache.get(roleData.role);
                embed.addFields(
                    { name: 'Role', value: role ? role.name : 'Unknown Role', inline: true },
                    { name: 'Emoji', value: roleData.emoji, inline: true }
                );
            });

            await interaction.reply({ embeds: [embed] });
        } else {
            const categories = Object.keys(autoroles);
            if (categories.length === 0) {
                return interaction.reply({ content: 'No autorole categories found.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('Autorole Categories')
                .setColor('#FFA500')
                .setDescription(categories.join('\n'))
                .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                .setThumbnail(interaction.client.user.displayAvatarURL());

            await interaction.reply({ embeds: [embed] });
        }
    },
};
