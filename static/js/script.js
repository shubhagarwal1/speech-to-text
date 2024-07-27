// scripts/app.js

const startButton = document.getElementById('start-button');
const micIcon = document.getElementById('mic-icon');
const output = document.getElementById('output');
const redButton = document.getElementById('red-button');
const greenButton = document.getElementById('green-button');
const blueButton = document.getElementById('blue-button');

const synth = window.speechSynthesis;
let recognition;
let isRecognizing = false;
const context = {};
let finalTranscript = '';
let debounceTimer;

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
        finalTranscript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        output.textContent = finalTranscript;

        // Reset debounce timer
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            handleCommand(finalTranscript.toLowerCase());
        }, 1000); // Adjust delay as needed
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
        micIcon.src = 'assets/icons/mic.svg'; // Mic on
        isRecognizing = false;
    };

    recognition.start();
    micIcon.src = 'assets/icons/mic-off.svg'; // Mic off
    isRecognizing = true;
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
    micIcon.src = 'assets/icons/mic.svg'; // Mic on
    isRecognizing = false;
}

function speak(text) {
    if (synth.speaking) {
        console.error('Already speaking...');
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => console.log('Speech synthesis finished');
    utterance.onerror = (event) => console.error('Speech synthesis error', event);
    synth.speak(utterance);
}

function handleCommand(command) {
    if (command.includes('turn on red')) {
        toggleButton(redButton, 'ON');
        context.lastAction = 'red on';
        speak('Turning on the red light.');
    } else if (command.includes('turn off red')) {
        toggleButton(redButton, 'OFF');
        context.lastAction = 'red off';
        speak('Turning off the red light.');
    } else if (command.includes('turn on green')) {
        toggleButton(greenButton, 'ON');
        context.lastAction = 'green on';
        speak('Turning on the green light.');
    } else if (command.includes('turn off green')) {
        toggleButton(greenButton, 'OFF');
        context.lastAction = 'green off';
        speak('Turning off the green light.');
    } else if (command.includes('turn on blue')) {
        toggleButton(blueButton, 'ON');
        context.lastAction = 'blue on';
        speak('Turning on the blue light.');
    } else if (command.includes('turn off blue')) {
        toggleButton(blueButton, 'OFF');
        context.lastAction = 'blue off';
        speak('Turning off the blue light.');
    } else if (command.includes('status')) {
        if (context.lastAction) {
            speak(`The last action was to turn ${context.lastAction}.`);
        } else {
            speak('No actions have been taken yet.');
        }
    } else if (command.includes('hello')) {
        speak('Hello! How can I assist you today?');
    } else {
        speak('Sorry, I didn’t understand that command.');
    }
}

function toggleButton(button, state) {
    const isActive = state === 'ON';
    button.classList.toggle('active', isActive);
    button.textContent = `${button.id.split('-')[0].charAt(0).toUpperCase() + button.id.split('-')[0].slice(1)} - ${state}`;
}
