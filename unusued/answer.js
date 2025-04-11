var libTrivia = require("../libTrivia.js");

module.exports = {
  name: 'answer',
  description: 'Answer to Play',
  async execute(message, args) {
    if (args.length < 1) {
      message.reply(`Please use in !answer [number] format`);
      return;
    }
    try {
     
      let questions = libTrivia.getQuestions();
      let thisQuestion = questions[libTrivia.getCurrentQuestion()];

      let selectedAnswerIndex = parseInt(args[0] - 1);
      let selectedAnswer = questions[libTrivia.getCurrentQuestion()].randomAnswers[parseInt(selectedAnswerIndex)];

      let correctAnswer = thisQuestion.answers[0];

      if (selectedAnswer == correctAnswer) {
        message.reply(`**You got it right** - *${thisQuestion.explain}*`);
      } else {
        message.reply(`**You got it wrong** - *Try again*`);
      }
    
    } catch (err) {
      message.reply(err.toString());
    }
  }
};