var libTrivia = require("../libTrivia.js");

module.exports = {
  name: 'play2',
  description: 'Play2',
  async execute(message, args) {
    try {

      let questions = libTrivia.getQuestions();
      var i = Math.floor(Math.random() * (questions.length - 0) + 0);

        libTrivia.setCurrentQuestion(i);
        const {  MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
        const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Nothing selected')
            .addOptions([
              {
                label: 'Answer 1',
                description: `${questions[i].randomAnswers[0]}`,
                value: `${questions[i].randomAnswers[0]}`,
              },
              {
                label: 'Answer 2',
                description: `${questions[i].randomAnswers[1]}`,
                value: `${questions[i].randomAnswers[1]}`,
              },
              {
                label: 'Answer 3',
                description: `${questions[i].randomAnswers[2]}`,
                value: `${questions[i].randomAnswers[2]}`,
              },
              {
                label: 'Answer 4',
                description: `${questions[i].randomAnswers[3]}`,
                value: `${questions[i].randomAnswers[3]}`,
              }
            ]),
        );
        await message.reply({ content: `${questions[i].question}`, components: [row] });
    } catch (err) {
      message.reply(err.toString());
    }
  }
};