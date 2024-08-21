const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion')
        .addStringOption(option => 
            option.setName('suggestion')
            .setDescription('Your suggestion')
            .setRequired(true)),
    async execute(interaction) {
        const suggestion = interaction.options.getString('suggestion');
        const suggestionsChannel = interaction.guild.channels.cache.get(config.suggestionsChannelId);

        if (!suggestionsChannel) {
            return interaction.reply({ content: 'Suggestions channel not found.', ephemeral: true });
        }

        const now = Date.now();
        const cooldownAmount = 30 * 60 * 1000;

        if (cooldowns.has(interaction.user.id)) {
            const expirationTime = cooldowns.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Please wait ${Math.ceil(timeLeft / 60)} more minute(s) before reporting again.`, ephemeral: true });
            }
        }
        cooldowns.set(interaction.user.id, now);
        setTimeout(() => cooldowns.delete(interaction.user.id), cooldownAmount);

        const embed = new EmbedBuilder()
            .setTitle('New Suggestion')
            .setDescription(suggestion)
            .setColor(0xFE9900)
            .setFooter({ text: config.embedFooter.text, iconURL: config.embedFooter.icon_url })
            .setTimestamp();

        const message = await suggestionsChannel.send({ embeds: [embed] });
        await message.react('✅');
        await message.react('❌');

        await interaction.reply({ content: 'Your suggestion has been submitted!', ephemeral: true });
    },
};
