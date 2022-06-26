var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'update',
    description: 'Get RSS Source Link',
    execute(message, args) {
        message.reply(`Loading Feeds from Sources`);
        try {
            libFlayer.loadFeeds();
        } catch (error) {
            console.log(error);
          }
        feedArray = libFlayer.getFeeds();

    }
};