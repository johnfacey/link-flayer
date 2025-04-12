const libTrivia = require('../libTrivia');

module.exports = {
  name: 'answer',
  description: 'Answers the current trivia question',
  async execute(message, args) {
    try {
      // Check if there's a current question
      const currentQuestionIndex = libTrivia.getCurrentQuestion();
      if (currentQuestionIndex === null) {
        return message.reply('There is no active trivia question. Start a new game with `!play`');
      }

      // Validate the answer format
      if (args.length !== 1 || !/^[1-4]$/.test(args[0])) {
        return message.reply('Please provide a valid answer number (1-4). Example: `!answer 1`');
      }

      const questions = libTrivia.getQuestions();
      const question = questions[currentQuestionIndex];
      const selectedAnswerIndex = parseInt(args[0]) - 1;
      const selectedAnswer = question.randomAnswers[selectedAnswerIndex];
      const correctAnswer = question.answers[0]; // First answer is always the correct one

      // Check if the answer is correct
      if (selectedAnswer === correctAnswer) {
        message.reply(`✅ **Correct!** ${question.explain}`);
      } else {
        message.reply(`❌ **Incorrect!** The correct answer was: **${correctAnswer}**\n${question.explain}`);
      }

      // Clear the current question
      libTrivia.setCurrentQuestion(null);
    } catch (error) {
      console.error('Error in answer command:', error);
      message.reply('There was an error processing your answer. Please try again later.');
    }
  },
}; 