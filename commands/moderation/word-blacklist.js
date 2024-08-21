const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word-blacklist')
        .setDescription('Manage the word blacklist')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a word to the blacklist')
                .addStringOption(option => 
                    option.setName('word')
                    .setDescription('The word to blacklist')
                    .setRequired(true)))

        .addSubcommand(subcommand => 
            subcommand
                .setName('remove')
                .setDescription('Remove a word from the blacklist')
                .addStringOption(option => 
                    option.setName('word')
                    .setDescription('The word to remove from the blacklist')
                    .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand
                .setName('all')
                .setDescription('Show all words in the blacklist')),


    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const word = interaction.options.getString('word');

        const blacklist = JSON.parse(fs.readFileSync('./commands/moderation/jsons/blacklist.json', 'utf8'));

        if (subcommand === 'add') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: 'You do not have permissions to add word to the blacklist.', ephemeral: true });
            }

            if (!blacklist.blacklistedWords.includes(word)) {
                blacklist.blacklistedWords.push(word);
                fs.writeFileSync('./commands/moderation/jsons/blacklist.json', JSON.stringify(blacklist, null, 2));

                const embedblacklist = new EmbedBuilder()
                    .setTitle('Word Blacklisted')
                    .setDescription(`The word has been added to the blacklist.`)
                    .addFields({
                        name: 'Word',
                        value: `${word}`,
                        inline: false
                    })
                    .setColor(0x7DDA58)
                    .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                    .setThumbnail(client.user.displayAvatarURL());

                return interaction.reply({ embeds: [embedblacklist] })
            } else {
                return interaction.reply({ content: `The word **${word}** is already in the blacklist.`, ehphemeral: true })
            }
        } else if (subcommand === 'remove') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: 'You do not have permissions to add word to the blacklist.', ephemeral: true });
            }
            
            const index = blacklist.blacklistedWords.indexOf(word);
            if (index !== -1) {
                blacklist.blacklistedWords.splice(index, 1);
                fs.writeFileSync('./commands/moderation/jsons/blacklist.json', JSON.stringify(blacklist, null, 2));

                const embedunblacklist = new EmbedBuilder()
                    .setTitle('Word Unblacklisted')
                    .setDescription( `The word has been removed from the blacklist.`)
                    .addFields({
                        name: 'Word',
                        value: `${word}`,
                        inline: false
                    })
                    .setColor(0x288B01)
                    .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                    .setThumbnail(client.user.displayAvatarURL());

                return interaction.reply({ embeds: [embedunblacklist] });
            } else {
                return interaction.reply({ content: `The word ${word} is not in the blacklist.`, ephemeral: true });
            }
        } else if (subcommand === 'all') {

            const embedall = new EmbedBuilder()
                .setTitle('Blacklisted Words')
                .setDescription(blacklist.blacklistedWords.join(', ' || 'No wolrds are currently blacklisted.'))
                .setColor(0xE4080A)
                .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                .setThumbnail(client.user.displayAvatarURL());
            
            return interaction.reply({ embeds: [embedall] });
        }
    },
};