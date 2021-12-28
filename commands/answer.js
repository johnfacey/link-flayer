var libFlayer = require("../libFlayer.js");

module.exports = {
	name: 'answer',
	description: 'Answer',
	async execute(message,args) {
        
        if (args.length < 1) {
            message.reply(`Please use in !answer [question] format`);
          return;
        }
        var question = encodeURIComponent(args.join(" "));

        var answerData = await libFlayer.getAnswer(question);
        message.reply(`${answerData.text} - ${answerData.source}`);
	}
};