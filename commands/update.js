var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'update',
    description: 'Get RSS Source Link',
    execute(message, args) {

        message.reply(`Updating Sources`);
        libFlayer.loadFeeds();
        feedArray = libFlayer.getFeeds();
        message.reply(`Sources Updated`);

    }
};