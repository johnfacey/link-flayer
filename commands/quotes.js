
var libFlayer = require("../libFlayer.js");
module.exports = {
	name: 'quote',
	description: 'Quote!',
	execute(message) {
		var quotes = libFlayer.getQuotes();
        var selectedQuote = Math.floor(Math.random() * quotes.length);
		message.reply(quotes[selectedQuote]);

	}
};