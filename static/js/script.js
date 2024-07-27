// script.js

const toggleButton = document.getElementById('toggle-button');
const micIcon = document.getElementById('mic-icon');
const output = document.getElementById('output');
const canvas = document.getElementById('waveform');
const canvasCtx = canvas.getContext('2d');

let recognition;
let isRecognizing = false;
let audioContext;
let analyser;
let dataArray;

toggleButton.addEventListener('click', () => {
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
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        speak('An error occurred. Please try again.');
    };

    recognition.onend = () => {
        console.log('Speech recognition service disconnected');
        micIcon.classList.replace('fa-microphone', 'fa-microphone-slash');
        isRecognizing = false;
        speak('Speech recognition stopped.');
        stopVisualization();
    };

    recognition.start();
    micIcon.classList.replace('fa-microphone-slash', 'fa-microphone');
    isRecognizing = true;
    speak('Speech recognition started. How can I assist you?');

    startVisualization();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
    micIcon.classList.replace('fa-microphone', 'fa-microphone-slash');
    isRecognizing = false;
    speak('Speech recognition stopped.');
    stopVisualization();
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2; // Faster speech rate
    window.speechSynthesis.speak(utterance);
}

function startVisualization() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia not supported on this browser.');
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        draw();
    }).catch(error => {
        console.error('Error accessing microphone:', error);
    });
}

function stopVisualization() {
    if (audioContext) {
        audioContext.close();
    }
}

function draw() {
    if (!canvasCtx || !analyser) return;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = '#121212';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#ff5722'; // Neon accent color
    canvasCtx.beginPath();

    const sliceWidth = canvas.width * 1.0 / analyser.frequencyBinCount;
    let x = 0;

    for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}
