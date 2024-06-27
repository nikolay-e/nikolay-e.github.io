// js/ui/displayManager.js

function updateStatsDisplay() {
    const elements = {
        'total-attempts': stats.totalAttempts,
        'correct-answers': stats.correctAnswers,
        'incorrect-answers': stats.incorrectAnswers,
        'correct-percentage': ((stats.correctAnswers / stats.totalAttempts) * 100).toFixed(2) + '%',
        'average-time': (stats.timePerQuestion.reduce((a, b) => a + b, 0) / stats.timePerQuestion.length).toFixed(2)
    };

    Object.entries(elements).forEach(([id, value]) => {
        document.getElementById(id).textContent = value;
    });
}

function updateWordSetsDisplay() {
    updateSetDisplay('focus-words-list', focusWordsSet);
    updateSetDisplay('mastered-vocabulary-list', masteredVocabularySet);
    updateSetDisplay('upcoming-words-list', upcomingWordsSet);
}

function updateSetDisplay(elementId, wordSet) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.error('updateSetDisplay: Failed to find element with ID', elementId);
        return;
    }

    container.innerHTML = '';

    let wordsArray = Array.from(wordSet);
    if (elementId === 'focus-words-list' && stats && stats.incorrectPerWord) {
        wordsArray.sort((a, b) => (stats.incorrectPerWord[a] || 0) - (stats.incorrectPerWord[b] || 0));
    }

    wordsArray.forEach(word => {
        const listItem = document.createElement('li');
        const translation = quizWords[word] || "No translation available";
        listItem.textContent = elementId === 'focus-words-list' && word === currentWord
            ? `${word} (translation hidden)`
            : `${word} (${translation})`;
        container.appendChild(listItem);
    });
}