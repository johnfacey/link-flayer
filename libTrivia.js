const fs = require('fs');
const path = require('path');

// Constants for response messages
const INCORRECT_MESSAGE = '❌ Incorrect! The correct answer was:';
const EXPLANATION_PREFIX = 'Explanation:';

let questions = [];
let currentQuestionIndex = null;

function loadQuestions() {
  try {
    console.log('Loading trivia questions from file...');
    const filePath = path.join(__dirname, 'trivia', 'trivia.data');
    console.log('Reading file from path:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('Trivia data file not found at:', filePath);
      return;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    console.log('Raw data length:', data.length);
    
    if (!data) {
      console.error('Trivia data file is empty');
      return;
    }
    
    const lines = data.split('\n').filter(line => line.trim());
    console.log('Number of non-empty lines:', lines.length);
    
    questions = lines.map((line, index) => {
      try {
        const parts = line.split('|');
        if (parts.length < 6) {
          console.error(`Invalid line format at index ${index}:`, line);
          return null;
        }
        
        const [id, category, question, correctAnswer, ...otherAnswers] = parts;
        const randomAnswers = [correctAnswer, ...otherAnswers.slice(0, 3)]
          .sort(() => Math.random() - 0.5);
        
        return {
          id: parseInt(id),
          category,
          question,
          answers: [correctAnswer],
          randomAnswers,
          explain: parts[parts.length - 1].trim()
        };
      } catch (lineError) {
        console.error(`Error processing line ${index}:`, lineError);
        return null;
      }
    }).filter(q => q !== null);
    
    if (questions.length > 0) {
      console.log('Sample parsed question:', JSON.stringify(questions[0], null, 2));
    }
    
    console.log(`Successfully loaded ${questions.length} trivia questions`);
  } catch (error) {
    console.error('Error loading trivia questions:', error);
    console.error('Error stack:', error.stack);
  }
}

function getQuestions() {
  if (questions.length === 0) {
    loadQuestions();
  }
  return questions;
}

function getCurrentQuestion() {
  if (currentQuestionIndex === null || currentQuestionIndex >= questions.length) {
    return null;
  }
  return questions[currentQuestionIndex];
}

function setCurrentQuestion(index) {
  if (index >= 0 && index < questions.length) {
    currentQuestionIndex = index;
    console.log(`Current question index set to: ${index}`);
  } else {
    console.error(`Invalid question index: ${index}`);
  }
}

// Load questions when the module is imported
loadQuestions();

module.exports = {
  getQuestions,
  getCurrentQuestion,
  setCurrentQuestion,
  INCORRECT_MESSAGE,
  EXPLANATION_PREFIX
}; 