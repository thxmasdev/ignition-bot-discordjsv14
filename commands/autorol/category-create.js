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
        .setName('autoroles-create')
        .setDescription('Create a new autorole category')
        .addStringOption(option =>
            option.setName('category')
            .setDescription('The category name')
            .setRequired(true)),

    
    async execute(interaction) {
        const category = interaction.options.getString('category');
        const autoroles = readAutoroles();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to remove roles from autorole categories.', ephemeral: true });
        }

        if (autoroles[category]) {
            return interaction.reply({ content: `Category ${category} already exists.`, ephemeral: true })
        }

        autoroles[category] = [];
        writeAutoroles(autoroles);

        await interaction.reply(`Category **${category}** has been created.`)
    }
}