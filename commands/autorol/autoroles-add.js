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
        .setName('autoroles-add')
        .setDescription('Add a role to an autorole category')
        .addStringOption(option => 
            option.setName('category')
            .setDescription('The name of the category')
            .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
            .setDescription('The role to add')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('emoji')
            .setDescription('The emoji for the role')
            .setRequired(true)),

    async execute(interaction) {
        const category = interaction.options.getString('category');
        const role = interaction.options.getRole('role');
        const emoji = interaction.options.getString('emoji');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to add roles to autorole categories.', ephemeral: true });
        }

        const autoroles = readAutoroles();

        if (!autoroles[category]) {
            return interaction.reply({ content: `Category **${category}** does not exist.`, ephemeral: true });
        }

        if (autoroles[category].length >= 10) {
            return interaction.reply({ content: `Category **${category}** already has 10 roles.`, ephemeral: true });
        }

        autoroles[category].push({ role: role.id, emoji });
        writeAutoroles(autoroles);

        await interaction.reply(`Role **${role.name}** with emoji ${emoji} has been added to category **${category}**.`);
    },
};
