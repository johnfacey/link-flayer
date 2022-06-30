var libTrivia = require("../libTrivia.js");

module.exports = {
  name: 'play',
  description: 'Play',
  async execute(message, args) {
    try {

      let questions = libTrivia.getQuestions();
      var i = Math.floor(Math.random() * (questions.length - 0) + 0);

      message.reply(`**Question**: *${questions[i].question}*
        **Select an Answer: ** 
        **[!answer 1]**.  *${questions[i].randomAnswers[0]}*
        **[!answer 2]**.  *${questions[i].randomAnswers[1]}*
        **[!answer 3]**.  *${questions[i].randomAnswers[2]}*
        **[!answer 4]**.  *${questions[i].randomAnswers[3]}*
        `);

        libTrivia.setCurrentQuestion(i);
    } catch (err) {
      message.reply(err.toString());
    }
  }
};