
var libFlayer = require("../libFlayer.js");
const quote_url = "https://zenquotes.io/api/quotes/";
module.exports = {
	name: 'quote',
	description: 'Quote!',
	async execute(message) {

		var quotes = await libFlayer.getQuotes(quote_url);
        var selectedQuote = Math.floor(Math.random() * quotes.length);
		message.reply(quotes[selectedQuote].q + " - " + quotes[selectedQuote].a);
	}
};