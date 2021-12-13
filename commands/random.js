
var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'random',
	description: 'Random',
	execute(message) {
		message.reply(
			`Selecting a random article...`
		);
        var feedArray = libFlayer.getFeeds();
        var i = Math.floor(Math.random() * (feedArray.length - 0) + 0 );
		
        message.reply(`Retrieving: [Link](${feedArray[i].link})`);
	}
};

