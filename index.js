const fs = require('fs');
const { prefix } = require('./config.json');
require('dotenv').config();
token = process.env.TOKEN;
const { quotes } = require('./quotes.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const PORT = process.env.PORT || 3000;
const express = require("express");
const server = express();
server.all("/",(req, res) => {
	res.send("Bot is Ready");
});

function keepAlive() {
	server.listen(PORT, () =>  {
		console.log("Keep Alive Server Running");
	})
}

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

var libFlayer = require("./libFlayer.js");
let linkFlayerMap = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

console.log("Link Flayer Bot Activating");
keepAlive();
client.login(token);                    //Load Client Discord Token
libFlayer.loadFeeds();                  //Load Configured Feeds



