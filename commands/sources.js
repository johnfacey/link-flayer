var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'sources',
    description: 'List RSS Sources',
    execute(message, args) {

        var command = args[0];
        var search = args[1];

        var sourceArray = libFlayer.getSources();
        sourceArray.forEach(source => {
            message.reply(`[${source.title}](${source.link})`);
        });

    }
};