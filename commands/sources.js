var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'sources',
    description: 'List RSS Sources',
    execute(message, args) {

        var sourceArray = libFlayer.getSources();
        sourceArray.forEach(source => {
            message.reply(`[${source.title}](${source.link})`);
        });

    }
};