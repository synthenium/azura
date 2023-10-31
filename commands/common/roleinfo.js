const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roleinfo',
    description: 'Provides information about a role',
    execute(message, args, prefix) {
        if (!args.length) {
            return message.channel.send('Please mention a role');
        }

        let role;
        if (message.mentions.roles.first()) {
            role = message.mentions.roles.first();
        }
        else {
            const roleName = args.join(" ");
            role = message.guild.roles.cache.find(r => r.name === roleName);
        }

        if (!role) {
            return message.channel.send(`No role found with the mentioned criteria.`);
        }

        const embed = new MessageEmbed()
            .setColor(role.color)
            .setTitle(role.name)
            .addField('Permissions', role.permissions.toArray().join('\n '))
            .addField('Color Hex Code', role.hexColor)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
