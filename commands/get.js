var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'get',
    description: 'Get RSS Source Link',
    execute(message, args) {

        if (args.length < 1) {
            message.reply(`Use !get [number] Ex: !get 25`);
            return;
        }
        var search = args[0];
        var catName = "All";
        var feedArray = libFlayer.getFeeds();
        message.reply(`Retrieving: [${catName}] (${feedArray[search].link})`);

    }
};