// js/quiz/csvHandler.js

function parseCSV(data) {
    const lines = data.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    quizWords = {};
    let currentSet = null;

    [focusWordsSet, masteredVocabularySet, upcomingWordsSet].forEach(set => set.clear());

    lines.forEach(line => {
        if (line.includes("Words to Learn")) {
            currentSet = focusWordsSet;
        } else if (line.includes("Learned Words")) {
            currentSet = masteredVocabularySet;
        } else if (line.includes("The Rest")) {
            currentSet = upcomingWordsSet;
        } else if (line) {
            const [word1, word2] = line.split(';');
            if (word1 && word2) {
                quizWords[word1] = word2;
                if (currentSet) currentSet.add(word1);
            }
        }
    });

    if (Object.keys(quizWords).length === 0) {
        console.error('parseCSV: No valid entries added to quizWords');
        return;
    }

    while (focusWordsSet.size < 20 && upcomingWordsSet.size > 0) {
        const wordToMove = upcomingWordsSet.values().next().value;
        focusWordsSet.add(wordToMove);
        upcomingWordsSet.delete(wordToMove);
    }
}

function generateCSV() {
    let data = [];

    data.push("Words to Learn");
    focusWordsSet.forEach(word => data.push(`${word};${quizWords[word]}`));

    data.push("\nLearned Words");
    masteredVocabularySet.forEach(word => data.push(`${word};${quizWords[word]}`));

    data.push("\nThe Rest");
    upcomingWordsSet.forEach(word => data.push(`${word};${quizWords[word]}`));

    let csvContent = data.join("\n");
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quiz-data.csv";
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}