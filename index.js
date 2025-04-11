const fs = require('fs');
const path = require('node:path');
const {
	prefix
} = require('./config.json');
require('dotenv').config();
token = process.env.TOKEN;
const {
	Routes
} = require('discord-api-types/v9');
const {
	quotes
} = require('./quotes.json');
//const Discord = require('discord.js');Client, Collection, Intents
const {
	Client,
	Collection,
	Intents,
	MessageActionRow,
	MessageButton
} = require('discord.js');
//const client = new Discord.Client();
const client = new Client({
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
});
const PORT = process.env.PORT || 3000;
const express = require("express");
const server = express();
var libFlayer = require("./libFlayer.js");


let linkFlayerMap = [];

server.all("/", (req, res) => {
	var htmlOutput = "LinkFlayer Bot is Ready - Sources loading <br />";

	var sources = libFlayer.getSources();
	sources.forEach(source => {
		htmlOutput += `
			<div style='margin-bottom:15px;'>

				<div> Title: ${source.title} </div>
				<div> Link: ${source.link} </div>
				<div> category: ${source.category} </div>

			</div>
			<div>
				<hr />

			</div>

			`
	});
	res.send(htmlOutput);

});

function keepAlive() {
	server.listen(PORT, () => {
		console.log("Keep Alive Server Running");
		try {
			//libFlayer.loadFeeds();
			//libFlayer.feedArray = libFlayer.getFeeds();
		} catch (error) {
			console.log(error);
		}
	})
}

//libTrivia.loadTrivia();



client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

/*
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
*/
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	//if (!interaction.isCommand()) return;
	if (!interaction.isSelectMenu()) return;

	let aaa = interaction.values[0];
	await interaction.channel.send({
		content: 'You picked something',
		ephemeral: true
	});

	try {
		//await command.execute(interaction);
	} catch (error) {
		//console.error(error);
		//await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		//message.reply('there was an error trying to execute that command!');
	}
});

console.log("Link Flayer Bot Activating");
keepAlive();
client.login(token); //Load Client Discord Token
try {
	//libFlayer.loadFeeds();
	libFlayer.loadLocalFeeds();
} catch (error) {
	console.log(error);
}