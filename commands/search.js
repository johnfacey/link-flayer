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
        var found = false;
        message.reply('Searching for: ' + search);

        let i = 0;
        let iSave = 0
        let count = 0;
        var feedArray = libFlayer.getFeeds();
        feedArray.forEach(linkFlay => {
            if (linkFlay.title.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                iSave = i;
                found = true;
                console.log(linkFlay.title);
                message.reply(`Use !get ${i} to view: ${linkFlay.title}`);
                count++;
            }
            i++;
            
        });
        if (count == 1) {
            //message.channel.send('Displaying 1 result');
            //message.channel.send('!get '+iSave);
        }

        if (count > 0) {
            message.channel.send(`Displaying results for: ${search}`);
        }
        
        if (!found) {
            message.reply(`No results found for: ${search}`);
        }

    }
};