const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const autorolesFilePath = path.join(__dirname, 'jsons', 'autoroles.json');

function readAutoroles() {
    if (!fs.existsSync(autorolesFilePath)) {
        fs.writeFileSync(autorolesFilePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(autorolesFilePath);
    return JSON.parse(data);
}

function writeAutoroles(data) {
    fs.writeFileSync(autorolesFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoroles-remove')
        .setDescription('Remove a role from an autorole category')
        .addStringOption(option => 
            option.setName('category')
            .setDescription('The name of the category')
            .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
            .setDescription('The role to remove')
            .setRequired(true)),

    async execute(interaction) {
        const category = interaction.options.getString('category');
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to remove roles from autorole categories.', ephemeral: true });
        }

        const autoroles = readAutoroles();

        if (!autoroles[category]) {
            return interaction.reply({ content: `Category **${category}** does not exist.`, ephemeral: true });
        }

        const index = autoroles[category].findIndex(r => r.role === role.id);
        if (index === -1) {
            return interaction.reply({ content: `Role **${role.name}** is not in category **${category}**.`, ephemeral: true });
        }

        autoroles[category].splice(index, 1);
        writeAutoroles(autoroles);

        await interaction.reply(`Role **${role.name}** has been removed from category **${category}**.`);
    },
};
