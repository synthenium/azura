const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'unban',
    description: 'Unbans a specified user',
    execute(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send('You do not have the required permissions to use this command.');
        }
        const userId = args[0];
        if (!userId) {
            return message.channel.send('Please provide the User ID to be unbanned.');
        }
        message.guild.members.unban(userId);
        
        let guildConfig = fs.existsSync('./configurations/guildConfiguration.json') ? JSON.parse(fs.readFileSync('./configurations/guildConfiguration.json')) : '{}';
        let logChannelID = guildConfig[message.guild.id];
        let logChannel = message.guild.channels.cache.get(logChannelID);
        if (logChannel) { 
            const embed = new MessageEmbed()
              .setColor('#ff0000')
              .setTitle('User Unbanned')
              .setDescription(`User with ID ${userId} was unbanned from server`)
              .setFooter(`Action performed by ${message.author.username}`);
            logChannel.send({ embeds: [embed] });
        }
    }
};