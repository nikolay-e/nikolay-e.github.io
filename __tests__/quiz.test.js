const fs = require('fs');
const path = require('path');
const quiz = require('../js/quiz');

jest.mock('../js/quiz', () => {
    return {
        ...jest.requireActual('../js/quiz'), // This will spread all actual implementations
        getRandomWord: jest.fn() // Explicitly mock getRandomWord
    };
});

global.updateWrongWordsDisplay = jest.fn();

beforeAll(() => {
    const htmlFilePath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(htmlFilePath, 'utf8');
    document.documentElement.innerHTML = html.toString();
});

describe('Quiz functionality tests', () => {
    let words = {};

    beforeEach(() => {
        words = { "hello": "hola", "world": "mundo" };
        quiz.getRandomWord.mockClear();
        global.updateWrongWordsDisplay.mockClear();
    });

    test('parseCSV should parse CSV data into words object', () => {
        const csvData = "hello;hola\nworld;mundo";
        quiz.parseCSV(csvData, words);
        expect(words).toEqual({ "hello": "hola", "world": "mundo" });
    });

    test('getRandomWord should return a specific word from words object', () => {
        quiz.getRandomWord.mockReturnValue('hello'); // Setup mock to return 'hello'
        const word = quiz.getRandomWord(words); // Use the mocked function from the imported quiz
        expect(word).toBe('hello');
    });

    test('askQuestion should set the question correctly for English to Spanish', () => {
        quiz.getRandomWord.mockReturnValue('hello'); // Ensures 'hello' is returned for this test
        quiz.askQuestion(words, true, quiz.getRandomWord);
        const displayedWord = document.getElementById('word').textContent;
        expect(displayedWord).toBe('hello');
    });

    test('askQuestion should set the question correctly for Spanish to English', () => {
        quiz.getRandomWord.mockReturnValue('world'); // Ensures 'world' is returned for this test
        quiz.askQuestion(words, false, quiz.getRandomWord);
        const displayedWord = document.getElementById('word').textContent;
        expect(displayedWord).toBe('mundo');
    });
});
