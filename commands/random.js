
var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'random',
	description: 'Random',
	async execute(message) {
		message.reply(
			`Selecting a random article...`
		);
        var i = Math.floor(Math.random() * (max - min + 1) + min );
		var feedArray = libFlayer.getFeeds();
        message.reply(`Retrieving: [Link](${feedArray[i].link})`);
	}
};

