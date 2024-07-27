Frontend (HTML + JavaScript)
┌────────────────────────────────────────┐
│ User clicks "Start Recognizing" button │
└──────────────────────────┬─────────────┘
                           │
                           ▼
       ┌───────────────────────────────────┐
       │ Browser requests microphone access│
       └───────────────────────────────────┘
                           │
                           ▼
     ┌──────────────────────────────────────┐
     │ Browser starts recording audio using │
     │       MediaRecorder API              │
     └──────────────────────────────────────┘
                           │
                           ▼
     ┌──────────────────────────────────────┐
     │ Audio data is collected in chunks and│
     │       stored temporarily             │
     └──────────────────────────────────────┘
                           │
                           ▼
     ┌──────────────────────────────────────┐
     │ Recording stops after a fixed duration│
     └──────────────────────────────────────┘
                           │
                           ▼
     ┌──────────────────────────────────────┐
     │ Audio chunks are combined into a Blob │
     │      and sent to the Flask backend    │
     │          using Fetch API              │
     └──────────────────────────────────────┘
                           │
                           ▼

Backend (Flask + Python)
┌──────────────────────────────────────────┐
│ Flask endpoint receives the audio file   │
│      and saves it temporarily            │
└──────────────────────────┬───────────────┘
                           │
                           ▼
      ┌────────────────────────────────────┐
      │ The `speech_recognition` library   │
      │    processes the audio file:       │
      │  - Audio file is loaded            │
      │  - Speech recognition is performed │
      │    using Google Web Speech API     │
      │  - Recognized text is extracted    │
      └────────────────────────────────────┘
                           │
                           ▼
     ┌─────────────────────────────────────┐
     │ Recognized text is sent back as a   │
     │         JSON response               │
     └─────────────────────────────────────┘
                           │
                           ▼
Frontend (HTML + JavaScript)
┌──────────────────────────────────────────┐
│ JavaScript updates the content of the    │
│ `<p id="output"></p>` element with       │
│      the recognized text                 │
└──────────────────────────────────────────┘
