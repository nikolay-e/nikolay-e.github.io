// js/utils/statsManager.js

let stats = {
    totalAttempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    attemptsPerWord: {},
    correctPerWord: {},
    incorrectPerWord: {},
    timePerWord: {},
    timePerQuestion: []
};

function updateStats(isTheAnswerCorrect, originalWord) {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    stats.totalAttempts++;
    stats.timePerQuestion.push(timeTaken);

    if (!stats.attemptsPerWord[originalWord]) {
        stats.attemptsPerWord[originalWord] = { attempts: 0, correct: 0, incorrect: 0 };
        stats.timePerWord[originalWord] = [];
    }

    let wordStats = stats.attemptsPerWord[originalWord];
    wordStats.attempts++;
    stats.timePerWord[originalWord].push(timeTaken);

    if (isTheAnswerCorrect) {
        stats.correctAnswers++;
        wordStats.correct++;
        if (wordStats.correct === 3 && focusWordsSet.has(originalWord)) {
            masteredVocabularySet.add(originalWord);
            focusWordsSet.delete(originalWord);
            if (upcomingWordsSet.size > 0) {
                let newWord = upcomingWordsSet.values().next().value;
                focusWordsSet.add(newWord);
                upcomingWordsSet.delete(newWord);
            }
        }
    } else {
        stats.incorrectAnswers++;
        wordStats.incorrect++;
        stats.incorrectPerWord[originalWord] = (stats.incorrectPerWord[originalWord] || 0) + 1;
    }
}