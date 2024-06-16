let stats = {
    totalAttempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    attemptsPerWord: {},
    correctPerWord: {},
    incorrectPerWord: {},
    firstAttemptCorrect: {},
    timePerWord: {},
    timePerQuestion: [],
    confusionMatrix: {}
};

function initializeConfusionMatrix(quizWords) {
    if (!quizWords || Object.keys(quizWords).length === 0) {
        console.error("Words object is not initialized");
        return;
    }
    Object.keys(quizWords).forEach(word => {
        stats.confusionMatrix[word] = {};
        Object.keys(quizWords).forEach(innerWord => {
            if (innerWord) {
                stats.confusionMatrix[word][innerWord] = 0;
            }
        });
    });
}

function updateStats(userAnswer, correctAnswer, originalWord) {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // time in seconds
    stats.totalAttempts++;
    stats.timePerQuestion.push(timeTaken);

    if (!stats.attemptsPerWord[originalWord]) {
        stats.attemptsPerWord[originalWord] = 0;
        stats.correctPerWord[originalWord] = 0;
        stats.incorrectPerWord[originalWord] = 0;
        stats.firstAttemptCorrect[originalWord] = null; // Track first attempt
        stats.timePerWord[originalWord] = [];
    }

    stats.attemptsPerWord[originalWord]++;
    stats.timePerWord[originalWord].push(timeTaken);

    if (userAnswer === correctAnswer) {
        stats.correctAnswers++;
        stats.correctPerWord[originalWord]++;
        if (stats.attemptsPerWord[originalWord] === 1) {
            stats.firstAttemptCorrect[originalWord] = true;
        }
    } else {
        stats.incorrectAnswers++;
        stats.incorrectPerWord[originalWord]++;
        if (stats.attemptsPerWord[originalWord] === 1) {
            stats.firstAttemptCorrect[originalWord] = false;
        }
        // Update confusion matrix
        if (originalWord && userAnswer) {
            if (!stats.confusionMatrix[originalWord]) {
                stats.confusionMatrix[originalWord] = {};
            }
            if (!stats.confusionMatrix[originalWord][userAnswer]) {
                stats.confusionMatrix[originalWord][userAnswer] = 0;
            }
            stats.confusionMatrix[originalWord][userAnswer]++;
        }
    }
}

function generateCSV(stats) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Total Attempts, Correct Answers, Incorrect Answers, Correct Answer Percentage\n";
    csvContent += `${stats.totalAttempts}, ${stats.correctAnswers}, ${stats.incorrectAnswers}, ${(stats.correctAnswers / stats.totalAttempts * 100).toFixed(2)}%\n\n`;
    csvContent += "Word, Total Attempts, Correct Attempts, Incorrect Attempts, Average Response Time (seconds)\n";
    Object.keys(stats.attemptsPerWord).forEach(word => {
        const avgTime = (stats.timePerWord[word].reduce((a, b) => a + b, 0) / stats.timePerWord[word].length).toFixed(2);
        csvContent += `${word}, ${stats.attemptsPerWord[word]}, ${stats.correctPerWord[word]}, ${stats.incorrectPerWord[word]}, ${avgTime}\n`;
    });
    csvContent += "\nAverage Time per Question (seconds)\n";
    const averageTime = (stats.timePerQuestion.reduce((a, b) => a + b, 0) / stats.timePerQuestion.length).toFixed(2);
    csvContent += `${averageTime}\n`;

    // Add confusion matrix to CSV
    csvContent += "\nConfusion Matrix\n";
    const headerRow = ["Word"].concat(Object.keys(quizWords)).join(",");
    csvContent += `${headerRow}\n`;
    Object.keys(stats.confusionMatrix).forEach(word => {
        const row = [word].concat(Object.keys(quizWords).map(innerWord => stats.confusionMatrix[word][innerWord] || 0)).join(",");
        csvContent += `${row}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quiz_stats.csv");
    document.body.appendChild(link);
    link.click();
}

function getMostImprovedWords() {
    const improvements = Object.keys(stats.correctPerWord).map(word => {
        const correct = stats.correctPerWord[word];
        const incorrect = stats.incorrectPerWord[word];
        const totalAttempts = stats.attemptsPerWord[word];
        const improvement = correct / totalAttempts - incorrect / totalAttempts;
        return { word, improvement };
    });

    improvements.sort((a, b) => b.improvement - a.improvement);

    return improvements.slice(0, 5).map(item => item.word);
}

try {
    if (process.env.NODE_ENV === 'test') {
        module.exports = { initializeConfusionMatrix, updateStats, generateCSV, getMostImprovedWords };
    }
} catch (e) {
    // do nothing
}
