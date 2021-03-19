var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'help',
	description: 'Help',
	execute(message) {
		message.reply('!help - Lists the available commands');
		message.reply('**!search** - Searches the RSS Sources: *!search google*');
		message.reply('**!get**- Retrieves Search By Index: *!get 25*');
		message.reply('**!add** - Add a new RSS Source Feed dynamically: *!add http://www.engadget.com/rss.xml*');
		message.reply('**!update** - Updates all current RSS Feeds: *!update*');
	}
};