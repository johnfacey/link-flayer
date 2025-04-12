const libTrivia = require('../libTrivia');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'play',
  description: 'Starts a trivia game',
  async execute(message, args) {
    try {
      console.log('Starting trivia game...');
      const questions = libTrivia.getQuestions();
      console.log('Retrieved questions array length:', questions.length);
      
      if (!Array.isArray(questions)) {
        console.error('Questions is not an array:', questions);
        return message.reply('There was an error loading the trivia questions. Please try again later.');
      }
      
      if (questions.length === 0) {
        console.error('No questions available');
        return message.reply('Sorry, there are no trivia questions available at the moment.');
      }

      // Select a random question
      const randomIndex = Math.floor(Math.random() * questions.length);
      console.log('Selected random question index:', randomIndex);
      const question = questions[randomIndex];
      console.log('Selected question:', JSON.stringify(question, null, 2));
      
      if (!question || !question.randomAnswers) {
        console.error('Invalid question object:', question);
        return message.reply('There was an error selecting a question. Please try again later.');
      }
      
      // Store the current question index
      libTrivia.setCurrentQuestion(randomIndex);

      // Create buttons for each answer
      const row = new MessageActionRow();
      try {
        question.randomAnswers.forEach((answer, index) => {
          row.addComponents(
            new MessageButton()
              .setCustomId(`trivia_answer_${index + 1}`)
              .setLabel(`${index + 1}`)
              .setStyle('PRIMARY')
          );
        });
      } catch (buttonError) {
        console.error('Error creating buttons:', buttonError);
        return message.reply('There was an error creating the answer buttons. Please try again later.');
      }

      // Format the message with the question and answers
      const answerOptions = question.randomAnswers
        .map((answer, index) => `${index + 1}. ${answer}`)
        .join('\n');

      const questionMessage = `**Category:** ${question.category}\n\n` +
        `**Question:** ${question.question}\n\n` +
        `**Options:**\n${answerOptions}\n\n` +
        `Click a button to answer!`;

      console.log('Sending question message...');
      // Send the message with buttons
      try {
        const sentMessage = await message.reply({
          content: questionMessage,
          components: [row]
        });

        console.log('Setting up collector...');
        // Set up a collector for the buttons
        const filter = i => i.customId.startsWith('trivia_answer_') && i.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
          try {
            console.log('Button clicked:', interaction.customId);
            const answerNumber = parseInt(interaction.customId.split('_')[2]);
            console.log('Selected answer number:', answerNumber);
            
            const currentQuestion = libTrivia.getCurrentQuestion();
            if (!currentQuestion) {
              console.error('No current question found');
              try {
                await interaction.reply({
                  content: 'Sorry, the question is no longer available. Please start a new game.',
                  ephemeral: false
                });
              } catch (replyError) {
                if (replyError.code === 10062) { // Unknown interaction
                  console.log('Interaction expired, ignoring');
                } else {
                  console.error('Error replying to interaction:', replyError);
                }
              }
              return;
            }

            console.log('Current question:', JSON.stringify(currentQuestion, null, 2));
            
            if (!currentQuestion.randomAnswers || !Array.isArray(currentQuestion.randomAnswers)) {
              console.error('Invalid question format:', currentQuestion);
              try {
                await interaction.reply({
                  content: 'There was an error processing your answer. Please try again later.',
                  ephemeral: false
                });
              } catch (replyError) {
                if (replyError.code === 10062) { // Unknown interaction
                  console.log('Interaction expired, ignoring');
                } else {
                  console.error('Error replying to interaction:', replyError);
                }
              }
              return;
            }

            const selectedAnswer = currentQuestion.randomAnswers[answerNumber - 1];
            const correctAnswer = currentQuestion.answers[0];
            console.log('Selected answer:', selectedAnswer);
            console.log('Correct answer:', correctAnswer);

            // Disable all buttons first
            const disabledRow = new MessageActionRow();
            currentQuestion.randomAnswers.forEach((answer, index) => {
              disabledRow.addComponents(
                new MessageButton()
                  .setCustomId(`trivia_answer_${index + 1}`)
                  .setLabel(`${index + 1}`)
                  .setStyle('SECONDARY')
                  .setDisabled(true)
              );
            });

            try {
              await sentMessage.edit({ components: [disabledRow] });
            } catch (editError) {
              console.error('Error editing message:', editError);
            }

            // Then send the answer response
            try {
              if (selectedAnswer === correctAnswer) {
                console.log('Answer was correct');
                await interaction.reply({
                  content: `✅ **Correct!**\n\n${libTrivia.EXPLANATION_PREFIX} ${currentQuestion.explain}`,
                  ephemeral: false
                });
              } else {
                console.log('Answer was incorrect');
                await interaction.reply({
                  content: `${libTrivia.INCORRECT_MESSAGE} **${correctAnswer}**\n\n${libTrivia.EXPLANATION_PREFIX} ${currentQuestion.explain}`,
                  ephemeral: false
                });
              }
            } catch (replyError) {
              if (replyError.code === 10062) { // Unknown interaction
                console.log('Interaction expired, ignoring');
              } else {
                console.error('Error replying to interaction:', replyError);
              }
            }

            libTrivia.setCurrentQuestion(null);
            collector.stop();
          } catch (error) {
            console.error('Error handling button interaction:', error);
            console.error('Error stack:', error.stack);
            try {
              await interaction.reply({
                content: 'There was an error processing your answer. Please try again later.',
                ephemeral: false
              });
            } catch (replyError) {
              if (replyError.code === 10062) { // Unknown interaction
                console.log('Interaction expired, ignoring');
              } else {
                console.error('Error replying to interaction:', replyError);
              }
            }
          }
        });

        collector.on('end', () => {
          if (!collector.ended) {
            console.log('Collector ended - disabling buttons');
            // Disable buttons if time runs out
            const disabledRow = new MessageActionRow();
            const currentQuestion = libTrivia.getCurrentQuestion();
            if (currentQuestion && currentQuestion.randomAnswers) {
              currentQuestion.randomAnswers.forEach((answer, index) => {
                disabledRow.addComponents(
                  new MessageButton()
                    .setCustomId(`trivia_answer_${index + 1}`)
                    .setLabel(`${index + 1}`)
                    .setStyle('SECONDARY')
                    .setDisabled(true)
                );
              });
              sentMessage.edit({ components: [disabledRow] }).catch(console.error);
            }
            libTrivia.setCurrentQuestion(null);
          }
        });
      } catch (messageError) {
        console.error('Error sending message:', messageError);
        console.error('Error stack:', messageError.stack);
        return message.reply('There was an error sending the question. Please try again later.');
      }
    } catch (error) {
      console.error('Error in play command:', error);
      console.error('Error stack:', error.stack);
      //message.reply('There was an error starting the trivia game. Please try again later.'  +  error.stack);
    }
  },
};