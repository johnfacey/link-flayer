
const fs = require('fs');

// Data Structures
let questions = [];
let currentQuestionIndex = 0;

exports.loadTrivia = function () {
  const allFileContents = fs.readFileSync('./trivia/trivia.data', 'utf-8');
  allFileContents.split(/\r?\n/).forEach(line =>  {
    console.log(`Line from file: ${line}`);
    let lineSplit = line.split('|');
    let triviaObject = {
        id: lineSplit[0],
        category: lineSplit[1],
        question: lineSplit[2],
        answers: [],
        randomAnswers: [],
        explain: lineSplit[7]
    }

      triviaObject.answers.push(lineSplit[3]);
      triviaObject.answers.push(lineSplit[4]);
      triviaObject.answers.push(lineSplit[5]);
      triviaObject.answers.push(lineSplit[6]);

      let randomAnswers = [];
      randomAnswers.push(lineSplit[3]);
      randomAnswers.push(lineSplit[4]);
      randomAnswers.push(lineSplit[5]);
      randomAnswers.push(lineSplit[6]);

      triviaObject.randomAnswers = this.shuffle(randomAnswers);
      questions.push(triviaObject);
  });
  
}
exports.setCurrentQuestion = function (index) {
  currentQuestionIndex = index;
}

exports.getCurrentQuestion = function () {
  return currentQuestionIndex;
}

exports.getQuestions = function () {
  return questions;
}
/*
exports.shuffle = function (thisArray, startIndex, endIndex) {
  if(endIndex == 0) endIndex = thisArray.length-1;
    for (var i = endIndex; i>startIndex; i--) {
      var randomNumber = Math.floor(Math.random()*endIndex)+startIndex;
      var tmp = thisArray[i];
      thisArray[i] = thisArray[randomNumber];
      thisArray[randomNumber] = tmp;
    }
  return thisArray;
}*/


exports.shuffle = function (array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


/**
 * Adds a new source url to configured Airtable
 * @constructor
 * @param {string} title - Title/Name of the RSS feed.
 * @param {string} link - URL of RSS feed.
 * @param {string} category - Category of RSS feed.
 */
exports.loadTriviaX = function (title, link, category) {

  for (i = 0; i < feeds.length; i++) {
    if (feeds[i].link == link) {
      return;
    }
  }

  base(userTable).create([{
    "fields": {
      "title": title,
      "link": link,
      "category": category
    }
  }], function (err, record) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(record.getId());

    var linkData = {
      title: `${title}`,
      link: `${link}`,
      category: `${category}`,
      id: record.getId()
    }

    feeds.push(linkData);

  });

}

