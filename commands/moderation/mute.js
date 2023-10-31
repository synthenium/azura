const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'Mutes a member for a specified amount of time',
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.channel.send('You do not have the required permissions to use this command.');
        }
        const user = message.mentions.members.first();
        if (!user) {
            return message.channel.send('Please mention the user to be muted.');
        }
        if (user.permissions.has('MANAGE_ROLES')) {
            return message.channel.send('This user cannot be muted.');
        }
        let role = message.guild.roles.cache.find(x => x.name === 'Muted');

        if (!role) {
            return message.channel.send('There is no role with the name "Muted", please create one.');
        }

        if (message.guild.me.roles.highest.position <= role.position) {
            return message.channel.send('Unable to assign. Bot role should be above muted role');
        }

        let time = args[1];
        if (!time) {
            return message.channel.send('Please specify a time.');
        }
        user.roles.add(role.id);

        let rawdata = fs.existsSync('./configurations/muted.json') ? fs.readFileSync('./configurations/muted.json') : '{}';
        let mutedUsers = JSON.parse(rawdata);

        mutedUsers[user.id] = Date.now() + ms(time);

        fs.writeFileSync('./configurations/muted.json', JSON.stringify(mutedUsers));

        message.channel.send(`Muted ${user} for ${time}`);

        let guildConfig = fs.existsSync('./configurations/guildConfiguration.json') ? JSON.parse(fs.readFileSync('./configurations/guildConfiguration.json')) : '{}';
        let logChannelID = guildConfig[message.guild.id];
        let logChannel = message.guild.channels.cache.get(logChannelID);

        if (logChannel) { 
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('User Muted')
                .setDescription(`${user} was muted for ${time}`)
                .setFooter(`Action performed by ${message.author.username}`);
            logChannel.send({ embeds: [embed] });
        }

        setTimeout(async function() {
            user.roles.remove(role);
            let rawdata = (fs.existsSync('./configurations/muted.json') && fs.readFileSync('./configurations/muted.json')) ? fs.readFileSync('./configurations/muted.json') : '{}';
            let mutedUsers = JSON.parse(rawdata);

            delete mutedUsers[user.id];

            fs.writeFileSync('./configurations/muted.json', JSON.stringify(mutedUsers));
            message.channel.send(`_${user} is now unmuted._`);
        }, ms(time));
    }
};