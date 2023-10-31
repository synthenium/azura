const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'purge',
    description: 'Deletes a specified amount of messages',
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send('You do not have the required permissions to use this command.');
        }

        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount || deleteCount < 2 || deleteCount > 50) {
            return message.channel.send("Please provide a number between 2 and 50 for the number of messages to delete.");
        }

        // fetch messages and delete them
        const fetched = await message.channel.messages.fetch({ limit: deleteCount + 1 });
        message.channel.bulkDelete(fetched);

        let guildConfig = fs.existsSync('./configurations/guildConfiguration.json') ? JSON.parse(fs.readFileSync('./configurations/guildConfiguration.json')) : '{}';
        let logChannelID = guildConfig[message.guild.id];
        let logChannel = message.guild.channels.cache.get(logChannelID);

        if (logChannel) {
          const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Messages Purged')
            .setDescription(`${deleteCount} messages were deleted from ${message.channel}`)
            .setFooter(`Action performed by ${message.author.username}`);

          logChannel.send({ embeds: [embed] });

          const deletedMessageLog = fetched.map(msg => `${msg.author.username}: ${msg.content}`).join('\n');
          const deletedMessageEmbed = new MessageEmbed()
            .setColor('#0000ff')
            .setTitle('Deleted Messages')
            .setDescription(deletedMessageLog)
            .setFooter('Following messages were purged');

          logChannel.send({ embeds: [deletedMessageEmbed] });
        }
    }
};
