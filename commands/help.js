var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'help',
	description: 'Help',
	execute(message) {
		message.reply('For a list of available commands type !commands');
	}
};