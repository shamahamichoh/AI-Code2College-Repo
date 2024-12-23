// Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/xJik2hSwH/";
let model, webcam, labelContainer, maxPredictions, currentBrain = "unkown";
let requestId;

// Initialize webcam and model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Setup label container
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
    
}


// Main prediction loop
async function loop() {
    webcam.update();
    await predict();
    requestId = window.requestAnimationFrame(loop);

}


// Predict function
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let found = false;
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        if (prediction[i].probability > 0.5) {
            currentBrain = prediction[i].className;
            found = true
        }
    }
    if (!found) currentBrain = "unknown";
    console.log("Brain type not recognized. Defaulting to 'unknown'.")
     // Update braub detexted in html
    document.getElementById("brain-type").textContent = currentBrain;

}
// function to close webcam
async function closeWebcam() {
    cancelAnimationFrame(requestId); // Stop prediction loop
    if (webcam.webcam) {
        const stream = webcam.webcam.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop all tracks (video and audio)
        
        // Remove webcam canvas
        if (webcam.canvas && document.getElementById("webcam-container").contains(webcam.canvas)) {
            document.getElementById("webcam-container").removeChild(webcam.canvas);
        }
        labelContainer.innerHTML = '';
    }
}

// Send message function
function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    addMessageToChat(userInput, 'user');
    console.log("Sending Brain Type:", currentBrain); // Log the brain type being sent


    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: userInput,
            brainType: currentBrain
        }),
    })
    .then(response => response.json())
    .then(data => {
        addMessageToChat(data.response, 'bot');
    })
    .catch((error) => {
        console.error('Error:', error);
            addMessageToChat("Error sending message. Please try again.", 'bot');

    });

    document.getElementById("user-input").value = "";
}

// Add message to chat
function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById("chat-container");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender + "-message");
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Event listener for Enter key
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});