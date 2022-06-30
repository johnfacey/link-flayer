var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'find',
    description: 'Find RSS Sources',
    execute(message, args) {
        try {
            if (args.length < 1) {
                message.reply(`Missing arguments`);
                return;
            }

            var search = args.join(" ");
            var found = false;

            let i = 0;
            let iSave = 0
            let count = 0;
            var feedArray = libFlayer.getFeeds();
            var searchString = "";
            var foundError = false;
            feedArray.forEach(linkFlay => {
                try {
                    if (linkFlay.title.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                        iSave = i;
                        found = true;
                        console.log(linkFlay.title);
                        searchString += `Use !get ${i} to view: ${linkFlay.title} \n`;
                        count++;
                        if (count > 5) {
                            message.reply(searchString);
                            searchString = "";
                        }
                    }
                    i++;
                } catch (error) {
                    foundError = true;
                    console.log(error);
                }

            });

            if (foundError) {
                message.reply("Error in search");
                return;
            } else {
                message.reply(searchString);
            }

            if (count == 1) {
                //message.channel.send('Displaying 1 result');
                //message.channel.send('!get '+iSave);
            }

            if (!found) {
                message.reply(`No results found for: ${search}`);
            }

        } catch (error) {
            message.reply(error.toString());
        }

    }
};