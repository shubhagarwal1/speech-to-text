// script.js

const startButton = document.getElementById('start-button');
const micIcon = document.getElementById('mic-icon');
const output = document.getElementById('output');
const redButton = document.getElementById('red-button');
const greenButton = document.getElementById('green-button');
const blueButton = document.getElementById('blue-button');

let recognition;
let isRecognizing = false;

startButton.addEventListener('click', () => {
    if (isRecognizing) {
        stopRecognition();
    } else {
        startRecognition();
    }
});

function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        output.textContent = transcript;
        handleCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
        micIcon.classList.replace('fa-microphone', 'fa-microphone-slash');
        isRecognizing = false;
    };

    recognition.start();
    micIcon.classList.replace('fa-microphone-slash', 'fa-microphone');
    isRecognizing = true;
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
    micIcon.classList.replace('fa-microphone', 'fa-microphone-slash');
    isRecognizing = false;
}

function handleCommand(command) {
    if (command.includes('turn on red')) {
        toggleButton(redButton, 'ON');
    } else if (command.includes('turn off red')) {
        toggleButton(redButton, 'OFF');
    } else if (command.includes('turn on green')) {
        toggleButton(greenButton, 'ON');
    } else if (command.includes('turn off green')) {
        toggleButton(greenButton, 'OFF');
    } else if (command.includes('turn on blue')) {
        toggleButton(blueButton, 'ON');
    } else if (command.includes('turn off blue')) {
        toggleButton(blueButton, 'OFF');
    }
}

function toggleButton(button, state) {
    const isActive = state === 'ON';
    button.classList.toggle('active', isActive);
    button.textContent = `${button.id.split('-')[0].charAt(0).toUpperCase() + button.id.split('-')[0].slice(1)} - ${state}`;
}
