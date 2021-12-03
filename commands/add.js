var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'add',
	description: 'Add RSS Source',
	execute(message,args) {
        
        if (args.length < 2) {
            message.reply(`Please use in !add [title] [https://domain.com/feed.xml] format`);
          return;
        }
        var title = args[0];
        var link = args[1];

        libFlayer.addSource(title,link);      
        libFlayer.loadFeeds();

	},
};