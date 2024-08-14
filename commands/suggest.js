const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Enviar sugerencias')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Crear una nueva sugerencia')
                .addStringOption(option => 
                    option.setName('suggestion')
                          .setDescription('La sugerencia a enviar')
                          .setRequired(true)),
        ),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const userId = interaction.user.id;
            const now = Date.now();
            const cooldownAmount = 30 * 60 * 1000;
            if (cooldowns.has(userId)) {
                const expirationTime = cooldowns.get(userId) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply(`Por favor espera ${Math.ceil(timeLeft / 60)} minutos antes de enviar otra sugerencia.`);
                }
            }
            cooldowns.set(userId, now);
            setTimeout(() => cooldowns.delete(userId), cooldownAmount);

            const suggestion = interaction.options.getString('suggestion');
            const channel = client.channels.cache.get(config.channelId);

            if (!channel) {
                return interaction.reply('Canal no encontrado.');
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('¡Nueva Sugerencia!')
                .setDescription(suggestion)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setFooter({ text: "Developed by thxmasdev" });

            const message = await channel.send({ embeds: [embed] });
            await message.react('👍');
            await message.react('👎');

            return interaction.reply('Sugerencia enviada.');
        }
    },
};
