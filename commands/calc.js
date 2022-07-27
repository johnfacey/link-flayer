var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'calc',
  description: 'Calc',
  execute(message, args) {
    try {
      if (args.length < 3) {
       
      }
      //var stringArgs = evaluate(args.join(" "));
      //message.reply(`Answer: ${stringArgs}`);
    } catch (err) {
      message.reply(err.toString());
    }
  }
};