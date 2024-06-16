let currentWord;
let startTime;

function parseCSV(data, quizWords) {
    const lines = data.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    if (lines.length === 0) return;

    const header = lines[0].split(';');
    const language1 = header[0];
    const language2 = header[1];

    for (let i = 1; i < lines.length; i++) {
        const [word1, word2] = lines[i].split(';');
        quizWords[word1] = word2;
    }

    return { language1, language2, quizWords };
}

function getRandomWord(quizWords) {
    const keys = Object.keys(quizWords);
    return keys[keys.length * Math.random() << 0];
}

function askQuestion(quizWords, direction, getRandomWordFn = getRandomWord) {
    const currentWord = getRandomWordFn(quizWords);
    document.getElementById('word').textContent = direction ? currentWord : quizWords[currentWord];
    startTime = new Date();
    updateWrongWordsDisplay(quizWords, currentWord);
}

try {
    if (process.env.NODE_ENV === 'test') {
        module.exports = { parseCSV, getRandomWord, askQuestion };
    }
} catch (e) {
    // do nothing
}

