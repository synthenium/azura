module.exports = {
    name: 'nickname',
    description: 'Set or change the nickname of a user',
    execute(message, args, prefix) {
      if (!message.member.permissions.has('MANAGE_NICKNAMES')) {
        return message.reply('You do not have permission to manage nicknames!');
      }
  
      const member = message.mentions.members.first();
      if (!member) {
        return message.reply('Please mention a user to set their nickname.');
      }
  
      const nickname = args.slice(1).join(' ');
      if (!nickname) {
        return message.reply('Please provide a nickname.');
      }
  
      member.setNickname(nickname)
        .then(() => {
          message.channel.send(`${member.user.username}'s nickname has been set to ${nickname}.`);
        })
        .catch(error => {
          console.error(error);
          message.reply('An error occurred while setting the nickname.');
        });
    },
  };