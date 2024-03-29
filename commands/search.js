var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'search',
  description: 'Search',
  async execute(message, args) {
    try {
      if (args.length < 1) {
        message.reply(`Please use in !search [question] format`);
        return;
      }
      var question = encodeURIComponent(args.join(" "));

      var answerData = await libFlayer.search(question);
      message.reply(`**Question**: ${decodeURIComponent(question)}\n\n**Answer**: ${answerData.text}\n\n **Source**: ${answerData.source}`);
    } catch (err) {
      message.reply(err.toString());
    }
  }
};