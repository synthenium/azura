const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'ban',
    description: 'Bans a specified user',
    execute(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send('You do not have the required permissions to use this command.');
        }
        const user = message.mentions.members.first();
        if (!user) {
            return message.channel.send('Please mention the user to be banned.');
        }

        const userRoles = user.roles.cache.map(role => role.name).join(', ');

        user.ban();

        let guildConfig = fs.existsSync('./configurations/guildConfiguration.json') ? JSON.parse(fs.readFileSync('./configurations/guildConfiguration.json')) : '{}';
        let logChannelID = guildConfig[message.guild.id];
        let logChannel = message.guild.channels.cache.get(logChannelID);

        if (logChannel) { 
            const embed = new MessageEmbed()
              .setColor('#ff0000')
              .setTitle('User Banned')
              .setDescription(`${user} was banned from server`)
              .addField('User Roles', userRoles ? `${userRoles}` : 'none')
              .setFooter(`Action performed by ${message.author.username}`);

            logChannel.send({ embeds: [embed] });
        }
    }
};