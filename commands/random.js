
var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'random',
	description: 'Random',
	execute(message, args) {
		var category = "";
		var catName = "All";
        if (args.length == 1) {
            category = args[0];
            catName = category;
        }
		
        var feedArray = libFlayer.getFeeds(category);
        var i = Math.floor(Math.random() * (feedArray.length - 0) + 0 );
		
        message.reply(`Retrieving: [${catName}](${feedArray[i].link})`);
	}
};

