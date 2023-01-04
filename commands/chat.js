var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'chat',
  description: 'Chat',
  async execute(message, args) {
    if (args.length < 1) {
      message.reply(`Please use in !chat [chat query]`);
      return;
    }
    try {
      var question = encodeURIComponent(args.join(" "));
     
      var response = await libFlayer.getChat(question);
      message.reply(`${message.author.username} ${response}`);
    
    } catch (err) {
      //message.reply(err.toString());
    }
  }
};