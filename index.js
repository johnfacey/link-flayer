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
const Scheduler = require('./libScheduler.js');
//const client = new Discord.Client();
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	]
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
	
	// Initialize and start the scheduler
	const scheduler = new Scheduler(client);
	scheduler.start();
	
	// Store the scheduler instance on the client
	client.scheduler = scheduler;
});

client.on('interactionCreate', async interaction => {
	try {
		// Handle command interactions
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ 
					content: 'There was an error executing this command!', 
					ephemeral: true 
				});
			}
		}
		// Handle button interactions
		else if (interaction.isButton()) {
			// Handle button interactions here
			const command = client.commands.get(interaction.customId.split('_')[0]);
			if (command) {
				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(error);
					await interaction.reply({ 
						content: 'There was an error handling this button!', 
						ephemeral: true 
					});
				}
			}
		}
		// Handle select menu interactions
		else if (interaction.isSelectMenu()) {
			if (!interaction.channel.isTextBased()) {
				await interaction.reply({
					content: 'This command can only be used in text channels!',
					ephemeral: true
				});
				return;
			}
			
			// Handle select menu interactions here
			const command = client.commands.get(interaction.customId.split('_')[0]);
			if (command) {
				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(error);
					await interaction.reply({ 
						content: 'There was an error handling this selection!', 
						ephemeral: true 
					});
				}
			}
		}
	} catch (error) {
		console.error('Error in interactionCreate:', error);
		if (interaction.isRepliable()) {
			await interaction.reply({ 
				content: 'There was an error processing this interaction!', 
				ephemeral: true 
			});
		}
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