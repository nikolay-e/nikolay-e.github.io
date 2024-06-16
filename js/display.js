function updateStatsDisplay() {
    document.getElementById('total-attempts').textContent = stats.totalAttempts;
    document.getElementById('correct-answers').textContent = stats.correctAnswers;
    document.getElementById('incorrect-answers').textContent = stats.incorrectAnswers;
    document.getElementById('correct-percentage').textContent = ((stats.correctAnswers / stats.totalAttempts) * 100).toFixed(2) + '%';
    const averageTime = (stats.timePerQuestion.reduce((a, b) => a + b, 0) / stats.timePerQuestion.length).toFixed(2);
    document.getElementById('average-time').textContent = averageTime;
}

function updateWrongWordsDisplay(quizWords, currentWord) {
    const sortedWords = Object.keys(stats.incorrectPerWord)
        .sort((a, b) => stats.incorrectPerWord[b] - stats.incorrectPerWord[a])
        .slice(0, 20);
    
    const worstWordsList = document.getElementById('words-to-learn-list');
    worstWordsList.innerHTML = '';

    sortedWords.forEach(word => {
        const listItem = document.createElement('li');
        if (word === currentWord) {
            listItem.textContent = "(translation hidden) - " + stats.incorrectPerWord[word] + " incorrect attempts";
        } else {
            const translation = quizWords[word];
            listItem.textContent = word + ` (${translation}) - ${stats.incorrectPerWord[word]} incorrect attempts`;
        }
        worstWordsList.appendChild(listItem);
    });
}

function updateAdditionalStatsDisplay() {
    const firstAttemptCorrectCount = Object.values(stats.firstAttemptCorrect).filter(Boolean).length;
    const firstAttemptTotalCount = Object.keys(stats.firstAttemptCorrect).length;
    const firstAttemptAccuracy = (firstAttemptCorrectCount / firstAttemptTotalCount * 100).toFixed(2);

    document.getElementById('first-attempt-accuracy').textContent = firstAttemptAccuracy + '%';

    const mostImprovedWords = getMostImprovedWords();
    document.getElementById('most-improved-words').textContent = mostImprovedWords.join(', ');
}

try {
    if (process.env.NODE_ENV === 'test') {
        module.exports = { updateStatsDisplay, updateWrongWordsDisplay, updateAdditionalStatsDisplay };
    }
} catch (e) {
    // do nothing
}
