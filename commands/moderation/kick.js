const fs = require('fs'); 
const { MessageEmbed } = require('discord.js'); 

module.exports = {
  name: 'kick',
  description: 'Kick a user from the server',
  execute(message, args, prefix) {

    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.reply('You do not have permission to kick members!');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Please mention a user to kick.');
    }

    member
      .kick()
      .then(() => {
        message.channel.send(`${member.user.tag} has been kicked.`);
        
        let guildConfig = fs.existsSync('./configurations/guildConfiguration.json') ? JSON.parse(fs.readFileSync('./configurations/guildConfiguration.json')) : '{}';
        let logChannelID = guildConfig[message.guild.id];
        let logChannel = message.guild.channels.cache.get(logChannelID);

        if (logChannel) { 
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('User Kicked')
                .setDescription(`${member.user.tag} was kicked.`)
                .setFooter(`Action performed by ${message.author.username}`);
            logChannel.send({ embeds: [embed] });
        }
      })
      .catch((error) => {
        console.error(error);
        message.reply('An error occurred while kicking the user.');
      });
  },
};