module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Listo para ver sugerencias en ${client.guilds.cache.size} servidores.`);
    },
};
