module.exports = {
    name: 'warn',
    description: 'Warn a user and keep a record of the warnings',
    execute(message, args, prefix) {
      
      if (!message.member.permissions.has('MANAGE_ROLES')) {
        return message.reply('You do not have permission to manage roles!');
      }
  
      const member = message.mentions.members.first();
      if (!member) {
        return message.reply('Please mention a user to warn.');
      }
  
      const reason = args.slice(1).join(' ');
      if (!reason) {
        return message.reply('Please provide a reason for warning the user.');
      }
  
      member.send(`You have been warned in ${message.guild.name}. Reason: ${reason}`)
        .then(() => {
          message.channel.send(`${member.user.tag} has been warned for ${reason}.`);
        })
        .catch((error) => {
          console.error(error);
          message.reply(`An error occurred while warning the user ${member.user.tag}.`);
        });
    },
  };
  