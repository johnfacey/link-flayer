var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'alert',
  description: 'Alert',
  async execute(message, args) {
    try {
      if (args.length < 1) {
        message.reply(`Please use in !alert [state]`);
        return;
      }
      var question = encodeURIComponent(args.join(" "));

      var answerData = await libFlayer.weatherAlert(question);
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