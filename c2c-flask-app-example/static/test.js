const questions = [
    {
        question: "What type of brain tumor is the picture above showing",
        image: "/static/Brain_glioma/glioma/glioma1.jpg",  // Direct path
        answers: [
            { text: "Glioma", correct: true },
            { text: "Meningioma", correct: false },
            { text: "Normal", correct: false },
            { text: "Pituitary", correct: false }
        ]
    },
    {
        question: "What type of brain tumor is the picture above showing",
        image: "/static/Brain_pituitary/pituitary/pituitary1.jpg",  // Direct path
        answers: [
            { text: "Glioma", correct: false },
            { text: "Meningioma", correct: false },
            { text: "Normal", correct: false },
            { text: "Pituitary", correct: true }
        ]
    },
    {
        question: "What type of brain tumor is the picture above showing",
        image: "/static/Brain_normal/notumor/normal1.jpg",  // Direct path
        answers: [
            { text: "Glioma", correct: false },
            { text: "Meningioma", correct: false },
            { text: "Normal", correct: true },
            { text: "Pituitary", correct: false }
        ]
    },
    {
        question: "What type of brain tumor is the picture above showing",
        image: "/static/Brain_meningioma/meningioma/meningioma.jpg",  // Direct path
        answers: [
            { text: "Glioma", correct: false },
            { text: "Meningioma", correct: true },
            { text: "Normal", correct: false },
            { text: "Pituitary", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons"); 
const nextButton = document.getElementById("next-btn");

let currentQIndex = 0;
let score = 0;

function startQuiz() {
    currentQIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQ = questions[currentQIndex];
    let qNumber = currentQIndex + 1;
    questionElement.innerHTML = qNumber + ". " + currentQ.question;

    const questionImage = document.getElementById("question-image");
    questionImage.src = currentQ.image;
    questionImage.style.display = "block"; // Ensure the image is displayed

    currentQ.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        button.dataset.correct = answer.correct; 
        button.addEventListener("click", selectAnswer); 
        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
    //hide image when going to next question
    const questionImage = document.getElementById("question-image");
    questionImage.src = ""; // Clear the previous image
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true"; 
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true; 
    });
    nextButton.style.display = "block"; 
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "inline-block";

    const backToAiButton = document.createElement("button");
    backToAiButton.innerHTML = "Back To Home";
    backToAiButton.classList.add("btn");
    backToAiButton.addEventListener("click", goBackToHome);  // Redirect to home page
    answerButtons.appendChild(backToAiButton);
    // hide image after the end
    const questionImage = document.getElementById("question-image");
    questionImage.style.display = "none";
}
function goBackToHome() {
    window.location.href = "/";  // Redirect to the homepage (adjust this path as needed)
}
function handleNextButton() {
    currentQIndex++;
    if (currentQIndex < questions.length) {  // Corrected from questions.length()
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});
startQuiz();