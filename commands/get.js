var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'get',
    description: 'Get RSS Source Link',
    execute(message, args) {

        if (args.length < 1) {
            message.reply(`Please use in !get [number] format`);
            return;
        }
        var search = args[0];

        var feedArray = libFlayer.getFeeds();
        message.reply(`Retrieving: [Link](${feedArray[search].link})`);

    }
};