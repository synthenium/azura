const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config()

const client = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MEMBERS
] });

const prefix = '?';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('测试阶段v1 | ?help', { type: 'WATCHING' });
});

client.commands = new Collection();

const commandFilesMods = fs.readdirSync('./commands/moderation').filter(file => file.endsWith('.js'));

for (const file of commandFilesMods) {
  const command = require(`./commands/moderation/${file}`);
  client.commands.set(command.name, command);
}

const commandFilesComms = fs.readdirSync('./commands/common').filter(file => file.endsWith('.js'));

for (const file of commandFilesComms) {
  const command = require(`./commands/common/${file}`);
  client.commands.set(command.name, command);
}

client.on('messageCreate', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args, prefix);
  } catch (error) {
    console.error(error);
    message.reply('在执行命令时发生了错误.');
  }
});

client.login(process.env.TOKEN);