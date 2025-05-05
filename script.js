// Sample paragraphs for the typing test
const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.",
    "The Internet is a global network of billions of computers and other electronic devices. With the Internet, it's possible to access almost any information, communicate with anyone else in the world, and do much more.",
    "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction."
];

// DOM Elements
const paragraphElement = document.getElementById('paragraph');
const inputArea = document.getElementById('input-area');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const timeElement = document.getElementById('time');
const tryAgainButton = document.getElementById('try-again');

// Variables
let startTime;
let timer;
let isTestActive = false;
let currentParagraph = '';
let currentWordIndex = 0;
let correctCharacters = 0;
let totalCharacters = 0;
let testDuration = 60; // default 1 min

// Initialize the test
function initTest() {
    // Select random paragraph
    currentParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    
    // Display paragraph with spans for each character (fix spacing)
    paragraphElement.innerHTML = currentParagraph
        .split('')
        .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');
    
    // Reset variables
    startTime = null;
    isTestActive = false;
    currentWordIndex = 0;
    correctCharacters = 0;
    totalCharacters = 0;
    
    // Reset display
    wpmElement.textContent = '0';
    accuracyElement.textContent = '0%';
    timeElement.textContent = `${testDuration}s`;
    inputArea.textContent = '';
    
    // Clear any existing timer
    if (timer) clearInterval(timer);
    
    // Re-enable input
    inputArea.setAttribute('contenteditable', 'true');
}

// Calculate WPM
function calculateWPM(timeInSeconds, correctWords) {
    const minutes = timeInSeconds / 60;
    return Math.round(correctWords / minutes);
}

// Calculate accuracy
function calculateAccuracy(correct, total) {
    return Math.round((correct / total) * 100) || 0;
}

// Update the display
function updateDisplay(forceEnd = false) {
    let timePassed = Math.floor((Date.now() - startTime) / 1000);
    let timeLeft = Math.max(testDuration - timePassed, 0);
    const correctWords = correctCharacters / 5;
    wpmElement.textContent = calculateWPM(timePassed, correctWords);
    accuracyElement.textContent = `${calculateAccuracy(correctCharacters, totalCharacters)}%`;
    timeElement.textContent = `${timeLeft}s`;
    // If time is up, end test
    if (timeLeft <= 0 || forceEnd) {
        clearInterval(timer);
        isTestActive = false;
        inputArea.setAttribute('contenteditable', 'false');
    }
}

// Handle input
function handleInput(e) {
    const inputText = inputArea.textContent;
    const paragraphSpans = paragraphElement.querySelectorAll('span');
    
    // Start timer on first keystroke
    if (!isTestActive) {
        isTestActive = true;
        startTime = Date.now();
        inputArea.setAttribute('contenteditable', 'true');
        timer = setInterval(() => {
            updateDisplay();
            let timePassed = Math.floor((Date.now() - startTime) / 1000);
            if (timePassed >= testDuration) {
                updateDisplay(true);
            }
        }, 1000);
    }
    
    // Reset all spans
    paragraphSpans.forEach(span => {
        span.className = '';
    });
    
    // Check each character
    let isCorrect = true;
    totalCharacters = inputText.length;
    correctCharacters = 0;
    
    for (let i = 0; i < paragraphSpans.length; i++) {
        if (i < inputText.length) {
            const spanChar = paragraphSpans[i].textContent === '\u00A0' ? ' ' : paragraphSpans[i].textContent;
            if (inputText[i] === spanChar) {
                paragraphSpans[i].className = 'correct';
                correctCharacters++;
            } else {
                paragraphSpans[i].className = 'incorrect';
                isCorrect = false;
            }
        } else if (i === inputText.length) {
            paragraphSpans[i].className = 'current';
        }
    }
    
    // Check if test is complete
    if (inputText.length === currentParagraph.length && isCorrect) {
        clearInterval(timer);
        isTestActive = false;
        updateDisplay(true);
    }
}

// Event Listeners
inputArea.addEventListener('input', handleInput);
tryAgainButton.addEventListener('click', () => {
    document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('bg-blue-400', 'text-white'));
    document.querySelector(`.duration-btn[data-duration="${testDuration}"]`).classList.add('bg-blue-400', 'text-white');
    initTest();
});

// Duration button logic
document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        testDuration = parseInt(this.getAttribute('data-duration'));
        document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('bg-blue-400', 'text-white'));
        this.classList.add('bg-blue-400', 'text-white');
        initTest();
    });
});

// Set default selected
document.querySelector('.duration-btn[data-duration="60"]').classList.add('bg-blue-400', 'text-white');

// Initialize the test when the page loads
initTest(); 