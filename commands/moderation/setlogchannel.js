const fs = require('fs');

module.exports = {
  name: 'setlogchannel',
  description: 'Set the log channel for moderation actions',
  execute(message, args) {
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.reply('You do not have permission to manage channels!');
    }

    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply('Please mention a channel to set as log channel.');
    }

    let guildConfig;
    if (fs.existsSync('./configurations/guildConfiguration.json')) {
      guildConfig = JSON.parse(fs.readFileSync('./configurations/guildConfiguration.json'));
    } else {
      guildConfig = {};
    }

    guildConfig[message.guild.id] = channel.id;
    fs.writeFileSync('./configurations/guildConfiguration.json', JSON.stringify(guildConfig));

    message.channel.send(`Log channel has been set to ${channel.name}`);
  },
};
