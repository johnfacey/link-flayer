var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'time',
  description: 'Time',
  async execute(message, args) {
    try {
      if (args.length < 1) {
        message.reply(`Select a time from the list`);
        return;
      }

      return; //////////////////////////////////
      var question = encodeURIComponent(args.join(" "));

      var answerData = await libFlayer.worldTime(question);

      answerData.forEach(feature => {
        message.reply(`
          ${feature.properties.areaDesc}
          ${feature.properties.headline}
          ${feature.properties.description}
		  `);

      })




    } catch (err) {
      message.reply(err.toString());
    }
  }
};