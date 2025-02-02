
const quizData = [
    {
        question: "If the base sequence in DNA is 5' AAAT 3', then the base sequence in mRNA is:",
        options: ["5' UUUU 3'", "3' UUUU 5'", "5' AAAU 3'", "3' AAAU 5'"],
        answer: "5' AAAU 3'"
    },
    {
        question: "Avery, MacLeod and McCarty concluded that:",
        options: ["DNA was the transforming agent", "RNA was the transforming agent", "Protein was the transforming agent", "All are correct"],
        answer: "DNA was the transforming agent"
    },
    {
        question: "Identify the characteristic which is not applicable to the genetic code:",
        options: ["Non-Polar", "Non-Overlapping", "Commaless", "Universal"],
        answer: "Non-Polar"
    },
    {
        question: "Ribose is differentiable from deoxyribose in having:",
        options: ["Two extra oxygen", "No oxygen", "Hydroxyl group at 2nd carbon", "One extra hydrogen"],
        answer: "Hydroxyl group at 2nd carbon"
    },
    {
        question: "A DNA strand is directly involved in the synthesis of all the following except:",
        options: ["Another DNA", "tRNA & mRNA", "rRNA", "Protein"],
        answer: "Protein"
    },
    {
        question: "The genes are responsible for growth and differentiation in an organism through regulation of:",
        options: ["Translocation", "Transformation", "Transduction and translation", "Translation and transcription"],
        answer: "Translation and transcription"
    },
    {
        question: "Genetic information is carried out by long chain molecules made up of:",
        options: ["Amino acids", "Enzymes", "Nucleotides", "Histone proteins"],
        answer: "Nucleotides"
    },
    {
        question: "Anticodons are found in:",
        options: ["mRNA", "tRNA", "rRNA", "In all"],
        answer: "tRNA"
    },
    {
        question: "Which of the following element is not found in nitrogenous base:",
        options: ["Nitrogen", "Hydrogen", "Carbon", "Phosphorus"],
        answer: "Phosphorus"
    },
    {
        question: "Transfer of genetic information from a polymer of nucleotides to a polymer of amino acids is",
        options: ["Replication", "Transcription", "Translation", "Reverse transcription"],
        answer: "Translation"
    }
];

// Sample leaderboard data
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let score = 0;
let currentQuestionIndex = 0;

// Get references to the elements
const startButton = document.getElementById('start-quiz');
const frontPage = document.getElementById('front-page');
const quizPage = document.getElementById('quiz-page');
const questionContainer = document.getElementById('question-container');
const submitButton = document.getElementById('submit');
const reverseButton = document.getElementById('reverse');
const nextButton = document.getElementById('next');
const progressBar = document.getElementById('progress-bar');
const resultsPage = document.getElementById('results-page');
const retryButton = document.getElementById('retry-btn');
const submitScoreButton = document.getElementById('submit-score-btn');
const nameInputContainer = document.getElementById('name-input-container');
const nameInput = document.getElementById('name');
const leaderboardList = document.getElementById('leaderboard');

startButton.addEventListener('click', function () {
    frontPage.classList.add('hidden');
    quizPage.classList.remove('hidden');
    startQuiz();
});

function startQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        displayResults();
        return;
    }

    const currentQuestion = quizData[currentQuestionIndex];
    questionContainer.innerHTML = `
        <h2>${currentQuestionIndex + 1}. ${currentQuestion.question}</h2>
        <ul class="options">
            ${currentQuestion.options.map((option) => 
                `<li class="option" data-answer="${option}">${option}</li>`
            ).join("")}
        </ul>
    `;
    submitButton.classList.remove('hidden');
    reverseButton.style.display = (currentQuestionIndex === 0) ? "none" : "inline-block";
    nextButton.classList.add('hidden');

    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => selectOption(option, option.textContent));
    });
}

function selectOption(selectedElement, selectedAnswer) {
    const correctAnswer = quizData[currentQuestionIndex].answer;
    const options = document.querySelectorAll('.options li');

    options.forEach(option => option.style.pointerEvents = "none");

    if (selectedAnswer === correctAnswer) {
        selectedElement.classList.add('correct');
        score++;
    } else {
        selectedElement.classList.add('wrong');
        options.forEach(option => {
            if (option.textContent.trim() === correctAnswer) {
                option.classList.add('correct');
            }
        });
    }

    nextButton.classList.remove('hidden');
}

submitButton.addEventListener('click', () => {
    currentQuestionIndex++;
    updateProgressBar();
    loadQuestion();
});

reverseButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

function updateProgressBar() {
    const progress = ((currentQuestionIndex / quizData.length) * 100) + "%";
    progressBar.style.width = progress;
}

function displayResults() {
    questionContainer.innerHTML = "";
    submitButton.classList.add('hidden');
    progressBar.style.width = "100%";

    let message = `You scored ${score} out of ${quizData.length}.`;
    
    if (score === quizData.length) {
        message += " 🎉 Excellent!";
    } else if (score >= quizData.length / 2) {
        message += " 😊 Good job!";
    } else {
        message += " 😢 Better luck next time.";
    }

    document.getElementById('score-display').innerText = `Your score: ${score}`;
    document.getElementById('congratulations-message').innerText = message;

    showLeaderboard();
    document.getElementById('results-page').classList.remove('hidden');
}

function showLeaderboard() {
    leaderboardList.innerHTML = '';  // Clear previous leaderboard
    leaderboard.sort((a, b) => b.score - a.score);  // Sort leaderboard by score (descending)

    leaderboard.forEach((entry, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}

submitScoreButton.addEventListener('click', function () {
    let name = nameInput.value;
    if (name && score) {
        leaderboard.push({ name: name, score: score });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));  // Save leaderboard to localStorage
        showLeaderboard();  // Display updated leaderboard with rankings
        nameInputContainer.classList.add('hidden');  // Hide name input container after submission
    }
});

retryButton.addEventListener('click', function () {
    document.getElementById('results-page').classList.add('hidden');
    document.getElementById('front-page').classList.remove('hidden');
    startQuiz();
});

document.addEventListener('DOMContentLoaded', function () {
    showLeaderboard();  // Display leaderboard on page load
});

