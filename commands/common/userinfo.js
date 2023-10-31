const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Retrieve information about a user',
  execute(message, args, prefix) {
    const user = message.mentions.users.first() || message.author;
    const member = message.mentions.members.first() || message.member;

    const roles = member.roles.cache.filter(role => message.guild.roles.cache.has(role.id)).map(role => role.name).join(', ') || 'No Roles';
    const username = user.username || 'Anonymous';
    const id = user.id || 'Unknown ID';
    const joinedAt = (member.joinedAt && member.joinedAt.toString()) || 'Unknown join date';

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('User Information')
      .addField('Username', username, true)
      .addField('ID', id, true)
      .addField('Join Date', joinedAt, true)
      .addField('Roles', roles, false);

    message.channel.send({ embeds: [embed] });
  },
};