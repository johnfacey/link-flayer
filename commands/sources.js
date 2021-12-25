var libFlayer = require("../libFlayer.js");

module.exports = {
    name: 'sources',
    description: 'List RSS Sources',
    execute(message, args) {

        var sourceArray = libFlayer.getSources();
        var sourceString = "";
        sourceArray.forEach(source => {
            sourceString +=`[${source.title}](${source.link}) \n`;
        });
        message.reply(sourceString);

    }
};