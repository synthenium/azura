module.exports = {
    name: 'serverinfo',
    description: 'Retrieve information about the server',
    execute(message, args, prefix) {
      const guild = message.guild;
      const serverInfo = `Server Name: ${guild.name}\nMember Count: ${guild.memberCount}\nCreation Date: ${guild.createdAt}\nServer Owner: ${guild.owner}`;
      message.channel.send(serverInfo);
    },
  };