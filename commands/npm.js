var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'npm',
  description: 'NPM',
  async execute(message, args) {
    try {
      if (args.length < 1) {
        message.reply(`Please use in !npm [npm-package] - ex !npm axios`);
        return;
      }
      var question = encodeURIComponent(args.join(" "));

      var returnData = await libFlayer.getNPM(question);
      if (returnData.length > 1) {
        let npmList = ``;
        message.reply(`Please use exact name:`);
        returnData.forEach(npmResult => {
          npmList += `- ${npmResult.name}\n`;
        });
        message.reply(`Use !npm with exact name to match: \n` + npmList);
      } else {
        message.reply(
          `
          Name: **${returnData[0].name}** - *${returnData[0].description}*
          Version: **${returnData[0].version}**
          Date: **${returnData[0].date}**
          NPM: **${returnData[0].links.npm}**
          Homepage: **${returnData[0].links.homepage}**
          `
        );
      }
      
  
    } catch (err) {
      message.reply(err.toString());
    }
  }
};