var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'search',
    description: 'Search RSS Sources',
    execute(message, args) {

        if (args.length < 1) {
            message.reply(`Missing arguments`);
            return;
        }

        var search = args[0];

        message.reply('Searching for: ' + search);

        let i = 0;
        var feedArray = libFlayer.getFeeds();
        feedArray.forEach(linkFlay => {
            if (linkFlay.title.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                console.log(linkFlay.title);
                message.reply(`Use !get ${i} to view: ${linkFlay.title}`);

            }
            i++;
        });

    }
};