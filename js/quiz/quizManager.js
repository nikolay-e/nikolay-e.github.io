// js/quiz/quizManager.js

let currentWord;
let direction = true;
let startTime;

function initializeQuiz(data) {
    try {
        parseCSV(data);
        askQuestion();
        updateWordSetsDisplay();
    } catch(error) {
        console.error('Error initializing quiz:', error);
    }
}

function continueQuiz() {
    askQuestion();
    updateWordSetsDisplay();
    updateStatsDisplay();
}

function askQuestion() {
    if (focusWordsSet.size === 0) initializeFocusWordsSet();
    currentWord = getRandomWordFromTopFew(focusWordsSet);
    document.getElementById('word').textContent = direction ? currentWord : quizWords[currentWord];
    startTime = new Date();
}

function verifyAnswer(userAnswer) {
    currentWord = document.getElementById('word').textContent;
    const correctAnswer = direction ? quizWords[currentWord] : Object.keys(quizWords).find(key => quizWords[key] === currentWord);
    const originalWord = direction ? currentWord : correctAnswer;

    let normalizedUserAnswer = normalizeAndSortAnswer(userAnswer);
    let normalizedCorrectAnswer = normalizeAndSortAnswer(correctAnswer);

    const isAnswerCorrect = compareAnswers(normalizedUserAnswer, normalizedCorrectAnswer);
    updateStats(isAnswerCorrect, originalWord);

    return isAnswerCorrect;
}

function initializeFocusWordsSet() {
    // Implementation needed
}

function normalizeAndSortAnswer(answer) {
    return answer.toLowerCase()
                 .split(',')
                 .map(item => item.trim().replace(/[^\p{Letter}]/gu, ''))
                 .filter(item => item.length > 0)
                 .sort();
}

function compareAnswers(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}