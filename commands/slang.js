var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'slang',
  description: 'Slang',
  async execute(message, args) {
    try {
      if (args.length < 1) {
        message.reply(`Please use in !slang [question] format`);
        return;
      }
      var question = encodeURIComponent(args.join(" "));

      var slangData = await libFlayer.getSlang(question);
      message.reply(`**Term**: ${decodeURIComponent(question)}\n\n**Answer**: ${slangData.definition}\n\n**Example**: ${slangData.example}`);
    } catch (e) {
      message.reply(e.toString());
    }

  }
};