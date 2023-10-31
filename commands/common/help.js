const { MessageEmbed } = require('discord.js');
const fs = require('fs');

const prefix = '?';

module.exports = {
  name: 'help',
  description: 'Display a list of available commands',
  async execute(message, args, prefix) {

    let commonCommands = fs.readdirSync('./commands/common').filter(file => file.endsWith('.js') && file !== 'help.js');
    let commonCommandDetails = commonCommands.map(file => {
      const command = require(`../common/${file}`);
      return `${prefix}${command.name}: ${command.description}`;
    });

    let moderationCommands = fs.readdirSync('./commands/moderation').filter(file => file.endsWith('.js'));
    let moderationCommandDetails = moderationCommands.map(file => {
      const command = require(`../moderation/${file}`);
      return `${prefix}${command.name}: ${command.description}`;
    });

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Help');

    if (commonCommandDetails.length > 0) {
      embed.addField('Info Commands', commonCommandDetails.join('\n'), false);
    }

    if (moderationCommandDetails.length > 0) {
      embed.addField('Moderation Commands', moderationCommandDetails.join('\n'), false);
    }

    await message.reply({ embeds: [embed] });
  },
};
