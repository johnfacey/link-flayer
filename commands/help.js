var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'help',
	description: 'Help',
	execute(message) {
		message.reply(
			`**!help** - *Lists the available commands*
			**!key** - Testing remote Airtable: *!key url*
			**!categories** - Displays Categories: *!categories*
			**!search** - Searches the RSS Sources: *!search google*
			**!get** - Retrieves Search By Index: *!get 25*
			**!add** - Add a new RSS Source: *!add http://www.engadget.com/rss.xml*
			**!update** - Updates all current RSS Feeds: *!update*
			**!quote** - Selects a random quote: *!quote*
			**!random** - Selects a random article: *!random*
			**!random category** - Selects a random article by category: *!random sports*
			**!search** - Instant Live Search: *!search salesforce*
			**!slang** - Urban Dictionary Search: *!slang slang*
			**!stock** - AlphaVantage Stock Search: *!stock IBM*
			**!play** - Plays a trivia game question: *!play*
			**!answer** - Answers for a question above: *!answer 1*
			`
		);
	}
};