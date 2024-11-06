const questions = [
    {
        question: "Example question 1 brain stuff",
        answers: [
            { text: "answer1", correct: true },
            { text: "answer2", correct: false },
            { text: "answer3", correct: false },
            { text: "answer4", correct: false }
        ]
    },
    {
        question: "Example question 2 brain stuff",
        answers: [
            { text: "answer1", correct: false },
            { text: "answer2", correct: false },
            { text: "answer3", correct: true },
            { text: "answer4", correct: false }
        ]
    },
    {
        question: "Example question 3 brain stuff",
        answers: [
            { text: "answer1", correct: false },
            { text: "answer2", correct: true },
            { text: "answer3", correct: false },
            { text: "answer4", correct: false }
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
    nextButton.style.display = "block";
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