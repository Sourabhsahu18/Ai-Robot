// Select elements
let box = document.querySelector(".box");
let btn = document.querySelector("button");

// Function to speak the input text using SpeechSynthesis API
const speakFunction = (input) => {
    let speakInput = new SpeechSynthesisUtterance(input);
    speakInput.rate = 1;
    speakInput.pitch = 1;
    speakInput.lang = "hi-IN"; // Set the language to Hindi

    // Set voice once voices are available
    const setVoice = () => {
        let voices = window.speechSynthesis.getVoices();
        let femaleVoice = voices.find(voice => voice.name.toLowerCase().includes("female") || (voice.lang === "hi-IN" && voice.name.toLowerCase().includes("google")));
        if (femaleVoice) speakInput.voice = femaleVoice;

        window.speechSynthesis.speak(speakInput); // Speak the text
    };

    // Wait for voices to load before setting the voice
    if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
    } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
    }
};

// Greeting function based on time of day
const greetingFunc = () => {
    let hour = new Date().getHours();
    if (hour < 12) {
        speakFunction("Good Morning, How can I help you?");
    } else if (hour < 18) {
        speakFunction("Good Afternoon, How can I help you?");
    } else {
        speakFunction("Good Evening, How can I help you?");
    }
};

// Start speech recognition when button is clicked
const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
        let recognition = new webkitSpeechRecognition();
        recognition.lang = "en-IN";
        recognition.onresult = (event) => {
            let spokenText = event.results[0][0].transcript.toLowerCase();
            handleCommand(spokenText); // Handle the command
        };
        recognition.start();
    } else {
        alert("Your browser doesn't support speech recognition");
    }
};

// Button click listener to start speech input
btn.onclick = () => {
    box.classList.add("btn-box");
    btn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i>`; // Change icon to show microphone is active
    startVoiceInput();
};

// Function to handle recognized commands
const handleCommand = (command) => {
    if (command.includes("hello") || command.includes("hi") || command.includes("hey")) {
        speakFunction("Hello, How can I help you?");
    } else if (command.includes("open youtube")) {
        speakFunction("Opening YouTube");
        setTimeout(() => {
            window.open("https://www.youtube.com/", "_blank");
        }, 1200);
    } else if (command.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: 'numeric', month: 'long' });
        speakFunction(`Today's date is ${date}`);
    } else if (command.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: 'numeric', minute: 'numeric' });
        speakFunction(`The current time is ${time}`);
    } else {
        window.open(`https://www.google.com/search?q=${command}`); // Default search on Google
        speakFunction(`This is what I found on the internet regarding ${command}`);
    }
};
