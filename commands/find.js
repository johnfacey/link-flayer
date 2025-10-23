var libFlayer = require("../libFlayer.js");
const Fuse = require('fuse.js');

module.exports = {
    name: 'find',
    description: 'Find RSS Sources',
    execute(message, args) {
        try {
            if (args.length < 1) {
                message.reply(`Missing arguments`);
                return;
            }

            const search = args.join(" ");
            const feedArray = libFlayer.getFeeds();

            // Options for fuzzy searching
            const options = {
                includeScore: true,
                keys: ['title', 'content'],
                threshold: 0.4, // Adjust this for more/less strict matching
            };

            const fuse = new Fuse(feedArray, options);
            const results = fuse.search(search);

            // Map results to the desired output format
            const searchResults = results.map(result => {
                // The original item is in result.item, its original index is result.refIndex
                return `Use !get ${result.refIndex} to view: ${result.item.title}`;
            }).slice(0, 15); // Limit to the top 15 results to avoid spam

            if (searchResults.length === 0) {
                message.reply(`No results found for: ${search}`);
            } else {
                // Discord has a 2000 character limit per message.
                // This splits the results into multiple messages if needed.
                // And adds a header to the search results.
                let header = `Found ${searchResults.length} results for "${search}":\n`;
                let response = "";
                for (const result of searchResults) {
                    if (response.length + result.length > 1900) {
                        message.reply(response);
                        response = "";
                    }
                    response += result + "\n";
                }
                if (response) {
                    message.reply(header + response);
                }
            }
        } catch (error) {
            message.reply(error.toString());
        }

    }
};