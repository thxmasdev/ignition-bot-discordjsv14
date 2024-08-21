const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const blacklist = JSON.parse(fs.readFileSync('./commands/moderation/jsons/blacklist.json', 'utf8'));
        const blacklistedWords = blacklist.blacklistedWords;

        for (const word of blacklistedWords) {
            if (message.content.toLowerCase().includes(word.toLowerCase())) {
                await message.delete();

                const embed = new EmbedBuilder()
                    .setTitle('Blacklist Words')
                    .setDescription('Do not mention that word')
                    .setColor(0xE4080A)
                    .addFields({
                        name: 'Word:',
                        value: `${word}`,
                        inline: false
                    })
                    .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
                    .setThumbnail(message.client.user.displayAvatarURL());

                return message.author.send({ embeds: [embed] }).catch(console.error);
            }
        }
    }
};
