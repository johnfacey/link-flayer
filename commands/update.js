var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'update',
    description: 'Get RSS Source Link',
    execute(message, args) {
        message.reply(`Updating Sources`);
        libFlayer.getConfig();
        message.reply(`Loading Feeds from Sources`);
        libFlayer.loadFeeds();
        feedArray = libFlayer.getFeeds();

    }
};