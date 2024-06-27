// js/quiz/wordSetManager.js

let focusWordsSet = new Set();
let masteredVocabularySet = new Set();
let upcomingWordsSet = new Set();
let quizWords = {};
let lastAskedWords = [];

function getRandomWordFromTopFew(wordSet) {
    let sortedWords = Array.from(wordSet).map(word => [word, stats.incorrectPerWord[word] || 0]);
    sortedWords.sort((a, b) => a[1] - b[1]);
    let topFewWords = sortedWords.slice(0, 10).map(item => item[0]);
    let availableWords = topFewWords.filter(word => !lastAskedWords.includes(word));

    if (availableWords.length > 0) {
        let selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        lastAskedWords.push(selectedWord);
        if (lastAskedWords.length > 7) {
            lastAskedWords.shift();
        }
        return selectedWord;
    } else {
        return topFewWords[Math.floor(Math.random() * topFewWords.length)];
    }
}