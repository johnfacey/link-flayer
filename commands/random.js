
var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'random',
	description: 'Random',
	execute(message, args) {
		let category = "";
		let catName = "All";
        if (args.length == 1) {
            category = args[0];
            catName = category;
        }
		
		message.reply(
			`Random article - loading...
			Category: ${catName}
			`
		);
        var feedArray = libFlayer.getFeeds(category);
        var i = Math.floor(Math.random() * (feedArray.length - 0) + 0 );
		
        message.reply(`Retrieving: [Link](${feedArray[i].link})`);
	}
};

