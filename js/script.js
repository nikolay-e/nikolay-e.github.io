let quizWords = {}
let direction = true

document.getElementById('answer').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();  // Prevent the default action to avoid submitting the form
        document.getElementById('submit').click();  // Trigger the submit button click programmatically
    }
});

document.getElementById('submit').addEventListener('click', function () {
    const userAnswer = document.getElementById('answer').value.trim();
    const currentWord = document.getElementById('word').textContent;
    const correctAnswer = direction ? quizWords[currentWord] : Object.keys(quizWords).find(key => quizWords[key] === currentWord);
    const originalWord = direction ? currentWord : correctAnswer;
    updateStats(userAnswer, correctAnswer, originalWord);
    updateStatsDisplay();
    updateAdditionalStatsDisplay();

    if (userAnswer === correctAnswer) {
        document.getElementById('feedback').textContent = 'Correct!';
    } else {
        document.getElementById('feedback').textContent = `Wrong. The correct answer for '${originalWord}' is '${correctAnswer}'`;
    }
    document.getElementById('answer').value = '';
    askQuestion(quizWords, direction);
});

document.getElementById('download-stats').addEventListener('click', function () {
    generateCSV(stats);
});




function handleFileUpload() {
    const file = document.getElementById('file-input').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            quizWords = parseCSV(text, quizWords).quizWords;
            initializeConfusionMatrix(quizWords);
            askQuestion(quizWords, direction);
        };
        reader.readAsText(file);
    }
}

document.getElementById('file-input').addEventListener('change', handleFileUpload);

document.getElementById('reset-default').addEventListener('click', function () {
    loadDefaultWords();  // This is the function we previously defined to load the default words
});

function loadDefaultWords() {
    fetch('quizWords.csv')
        .then(response => response.text())
        .then(data => {
            quizWords = parseCSV(data, quizWords).quizWords;
            initializeConfusionMatrix(quizWords);
            askQuestion(quizWords, direction);
        })
        .catch(error => {
            console.error('Error loading quizWords:', error);
        });
}
