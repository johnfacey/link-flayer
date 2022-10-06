var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'code',
  description: 'Code',
  async execute(message, args) {
    try {
      if (args.length < 1) {
        message.reply(`Please use in !code [search term] - ex !code python loop`);
        return;
      }
      var question = encodeURIComponent(args.join(" "));

      var returnData = await libFlayer.getCode(question);
      if (returnData.length > -1) {
        message.reply(
          `
          Name: **${returnData[0].name}**
          Snippet: **${returnData[0].snippet}**
          URL: **${returnData[0].url}**
          `
        );
      } else {
        message.reply('No result found');
      }
      
  
    } catch (err) {
      message.reply(err.toString());
    }
  }
};