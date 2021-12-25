var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'add',
	description: 'Add RSS Source',
	execute(message,args) {
        
        if (args.length < 3) {
            message.reply(`Please use in !add [title] [https://domain.com/feed.xml] [category] format`);
          return;
        }
        var title = args[0];
        var link = args[1];
        var category = args[2];

        var result = libFlayer.addSource(title,link,category); 
        if (result) {
          message.reply(`Adding ${title} to the list of RSS sources`);
        } else {
          message.reply(`${title} already exists in the list of RSS sources`);
        }
        
        var sources = libFlayer.getSources();  
        libFlayer.loadFeeds();

	}
};