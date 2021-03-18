var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'add',
	description: 'Add RSS Source',
	execute(message,args) {
        
        if (args.length < 2) {
            message.reply(`Please use in !get [number] format`);
          return;
        }
        var command = args[0];
        var param1 = args[1];
        libFlayer.addSource(param1);      
        libFlayer.loadFeeds();

	},
};