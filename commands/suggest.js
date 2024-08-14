const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config.json');

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Gestiona las sugerencias')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Crear una nueva sugerencia')
                .addStringOption(option =>
                    option.setName('suggestion')
                        .setDescription('La sugerencia a enviar')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('accept')
                .setDescription('Aceptar una sugerencia')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ID del mensaje de la sugerencia')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('deny')
                .setDescription('Denegar una sugerencia')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ID del mensaje de la sugerencia')
                        .setRequired(true))),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const userId = interaction.user.id;
            const now = Date.now();
            const cooldownAmount = 30 * 60 * 1000; // Tiempo de Cooldown
            if (cooldowns.has(userId)) {
                const expirationTime = cooldowns.get(userId) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({ content: `Por favor espera ${Math.ceil(timeLeft / 60)} minutos antes de enviar otra sugerencia.`, ephemeral: true });
                }
            }
            cooldowns.set(userId, now);
            setTimeout(() => cooldowns.delete(userId), cooldownAmount);

            const suggestion = interaction.options.getString('suggestion');
            const channel = client.channels.cache.get(config.channelId);

            if (!channel) {
                return interaction.reply({ content: 'No encuentra el ID del canal o no esta configurado el sistema de sugerencias.', ephemeral: true });
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

        } else if (subcommand === 'accept' || subcommand === 'deny') {
            const messageId = interaction.options.getString('message_id');
            const channel = client.channels.cache.get(config.channelId);

            if (!channel) {
                return interaction.reply({ content: 'No encuentra el ID del mensaje.', ephemeral: true });
            }

            try {
                const message = await channel.messages.fetch(messageId);
                const oldEmbed = message.embeds[0];

                const embed = new EmbedBuilder()
                    .setColor(oldEmbed.color)
                    .setDescription(oldEmbed.description)
                    .setAuthor({
                        name: oldEmbed.author.name,
                        iconURL: oldEmbed.author.iconURL
                    })
                    .setFooter({ text: oldEmbed.footer.text });

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: 'No tienes permisos de administrador para ejecutar este comando.', ephemeral: true });
                } // Este pedacito de codigo es para que ningun usuario pueda ejecutar los subcommands, pero si el comando de /suggest create <suggestion>

                if (subcommand === 'accept') {
                    embed.setTitle('Sugerencia Aceptada')
                        .setColor('#00ff00');

                    await message.reactions.removeAll(); // Removera todos las reacciones.

                    await message.react('❤'); // Agregaria un emoji de reaccion al embed de sugerencia aceptada.

                } else if (subcommand === 'deny') {
                    embed.setTitle('Sugerencia Denegada')
                        .setColor('#ff0000');

                    await message.reactions.removeAll(); // Removera todas las reacciones.

                }

                await message.edit({ embeds: [embed] });

                return interaction.reply({ content: `Sugerencia ${subcommand === 'accept' ? 'aceptada' : 'denegada'}.`, ephemeral: true });

            } catch (error) {
                console.error('Error al gestionar la sugerencia:', error);
                return interaction.reply({ content: 'No se puedo encontrar el mensaje de la sugerencia.', ephemeral: true });
            }
        }
    },
};
