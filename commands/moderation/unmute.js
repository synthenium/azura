const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Unmute a user in the server',
  execute(message, args, prefix) {
    if (!message.member.permissions.has('MANAGE_ROLES')) {
          return message.reply('You do not have permission to manage roles!');
      }
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Please mention a user to unmute.');
    }
    const mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!mutedRole || !member.roles.cache.has(mutedRole.id)) {
        return message.reply('Either the "Muted" role does not exist or the user is not muted.');
    }
    member.roles.remove(mutedRole)
        .then(() => {
            message.channel.send(`${member.user.tag} has been unmuted.`);
            
            let guildConfig = fs.existsSync('./configurations/guildConfiguration.json') ? JSON.parse(fs.readFileSync('./configurations/guildConfiguration.json')) : '{}';
            let logChannelID = guildConfig[message.guild.id];
            let logChannel = message.guild.channels.cache.get(logChannelID);
            if (logChannel) { 
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('User Unmuted')
                    .setDescription(`${member.user.tag} was unmuted.`)
                    .setFooter(`Action performed by ${message.author.username}`);
                logChannel.send({ embeds: [embed] });
            }
           
            if (fs.existsSync('./configurations/muted.json')) {
                let mutedData = JSON.parse(fs.readFileSync('./configurations/muted.json'));
                delete mutedData[member.id];
                fs.writeFileSync('./configurations/muted.json', JSON.stringify(mutedData));
            }
        })
        .catch((error) => {
            console.error(error);
            message.reply('An error occurred while unmuting the user.');
        });
  },
};