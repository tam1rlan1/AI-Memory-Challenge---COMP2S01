// =====================================
// GAME SETTINGS
// =====================================

const levels = [

    {
        level: 1,
        numbers: 4,
        displayTime: 5000,
        questions: 3
    },

    {
        level: 2,
        numbers: 6,
        displayTime: 4000,
        questions: 3
    },

    {
        level: 3,
        numbers: 8,
        displayTime: 3000,
        questions: 3
    }

];


// =====================================
// GAME STATE
// =====================================

let currentLevel = 0;

let currentQuestion = 0;

let score = 0;

let correctAnswers = 0;

let totalQuestions = 0;

let currentNumbers = {};

let currentPositions = [];

let currentQuestionData = null;

let hintUsed = false;

let gameStartTime = null;

let timerInterval = null;


// =====================================
// SCREEN MANAGEMENT
// =====================================

function showScreen(screenId) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });


    document
        .getElementById(screenId)
        .classList.add("active");

}


// =====================================
// START / HOW TO PLAY BUTTONS
// =====================================

document
    .getElementById("start-btn")
    .addEventListener("click", startGame);


document
    .getElementById("how-to-play-btn")
    .addEventListener("click", () => {

        showScreen("how-to-play-screen");

    });


document
    .getElementById("how-start-btn")
    .addEventListener("click", startGame);


document
    .getElementById("how-back-btn")
    .addEventListener("click", () => {

        showScreen("start-screen");

    });


// =====================================
// START GAME
// =====================================

function startGame() {

    currentLevel = 0;

    currentQuestion = 0;

    score = 0;

    correctAnswers = 0;

    totalQuestions = 0;

    currentNumbers = {};

    currentPositions = [];

    currentQuestionData = null;


    document
        .getElementById("score-display")
        .textContent = "0";


    document
        .getElementById("time-display")
        .textContent = "00:00";


    gameStartTime = Date.now();


    startTimer();


    showScreen("game-screen");


    startLevel();

}


// =====================================
// TIMER
// =====================================

function startTimer() {

    clearInterval(timerInterval);


    timerInterval = setInterval(() => {

        const elapsed =
            Math.floor(
                (Date.now() - gameStartTime) / 1000
            );


        const minutes =
            Math.floor(elapsed / 60)
                .toString()
                .padStart(2, "0");


        const seconds =
            (elapsed % 60)
                .toString()
                .padStart(2, "0");


        document
            .getElementById("time-display")
            .textContent =
            `${minutes}:${seconds}`;

    }, 1000);

}


// =====================================
// START LEVEL
// =====================================

function startLevel() {

    currentQuestion = 0;


    document
        .getElementById("level-display")
        .textContent =
        levels[currentLevel].level;


    nextQuestion();

}


// =====================================
// NEXT QUESTION
// =====================================

function nextQuestion() {

    const level =
        levels[currentLevel];


    if (
        currentQuestion >=
        level.questions
    ) {

        nextLevel();

        return;

    }


    currentQuestion++;


    document
        .getElementById("question-display")
        .textContent =
        `${currentQuestion}/${level.questions}`;


    clearGameArea();


    generateNumbers(level.numbers);


    showNumbers(level.displayTime);

}


// =====================================
// ALL EIGHT POSITIONS
// =====================================

const allPositions = [

    "top",

    "top-right",

    "right",

    "bottom-right",

    "bottom",

    "bottom-left",

    "left",

    "top-left"

];


// =====================================
// RANDOM POSITION SELECTION
// =====================================

function getRandomPositions(count) {

    /*
        Make a copy so the original
        array is not modified.
    */

    const shuffled =
        [...allPositions];


    /*
        Fisher-Yates shuffle
    */

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] =
        [
            shuffled[j],
            shuffled[i]
        ];

    }


    return shuffled.slice(0, count);

}


// =====================================
// GENERATE NUMBERS
// =====================================

function generateNumbers(numberCount) {

    currentNumbers = {};


    const circle =
        document.getElementById(
            "memory-circle"
        );


    circle
        .querySelectorAll(".number-slot")
        .forEach(slot => slot.remove());


    /*
        IMPORTANT:

        Level 1 = random 4 of 8
        Level 2 = random 6 of 8
        Level 3 = all 8
    */

    currentPositions =
        getRandomPositions(numberCount);


    currentPositions.forEach(position => {


        const value =
            Math.floor(
                Math.random() * 20
            ) + 1;


        currentNumbers[position] =
            value;


        const slot =
            document.createElement("div");


        slot.className =
            "number-slot";


        slot.textContent =
            value;


        slot.dataset.position =
            position;


        circle.appendChild(slot);


        positionNumber(
            slot,
            position
        );

    });

}


// =====================================
// POSITION NUMBER
// =====================================

function positionNumber(
    element,
    position
) {

    const positions = {

        "top": {
            x: 50,
            y: 8
        },

        "top-right": {
            x: 79,
            y: 21
        },

        "right": {
            x: 92,
            y: 50
        },

        "bottom-right": {
            x: 79,
            y: 79
        },

        "bottom": {
            x: 50,
            y: 92
        },

        "bottom-left": {
            x: 21,
            y: 79
        },

        "left": {
            x: 8,
            y: 50
        },

        "top-left": {
            x: 21,
            y: 21
        }

    };


    const coordinates =
        positions[position];


    element.style.left =
        `${coordinates.x}%`;


    element.style.top =
        `${coordinates.y}%`;

}


// =====================================
// SHOW NUMBERS
// =====================================

function showNumbers(displayTime) {

    const slots =
        document.querySelectorAll(
            ".number-slot"
        );


    slots.forEach(slot => {

        slot.style.visibility =
            "visible";

    });


    document
        .getElementById("question")
        .textContent =
        "Memorize the numbers and their positions...";


    document
        .getElementById("answer-area")
        .innerHTML = "";


    document
        .getElementById("submit-btn")
        .classList.add("hidden");


    document
        .getElementById("hint-btn")
        .classList.add("hidden");


    document
        .getElementById("dont-know-btn")
        .classList.add("hidden");


    document
        .getElementById("hint-area")
        .classList.remove("visible");


    document
        .getElementById("hint-area")
        .innerHTML = "";


    document
        .getElementById("feedback")
        .textContent = "";


    setTimeout(() => {

        hideNumbers();


        document
            .getElementById("hint-btn")
            .classList.remove("hidden");


        document
            .getElementById("dont-know-btn")
            .classList.remove("hidden");


        createQuestion();

    }, displayTime);

}


// =====================================
// HIDE NUMBERS
// =====================================

function hideNumbers() {

    document
        .querySelectorAll(".number-slot")
        .forEach(slot => {

            slot.style.visibility =
                "hidden";

        });

}


// =====================================
// CREATE QUESTION
// =====================================

function createQuestion() {

    hintUsed = false;


    /*
        Pick first position
    */

    const position1 =
        currentPositions[
            Math.floor(
                Math.random() *
                currentPositions.length
            )
        ];


    /*
        Pick a different second position
    */

    let position2;


    do {

        position2 =
            currentPositions[
                Math.floor(
                    Math.random() *
                    currentPositions.length
                )
            ];

    }
    while (
        position2 === position1
    );


    const value1 =
        currentNumbers[position1];


    const value2 =
        currentNumbers[position2];


    /*
        Only two question types:

        0 = Recall
        1 = Sum
    */

    const questionType =
        Math.floor(
            Math.random() * 2
        );


    let questionText;

    let correctAnswer;


    // =================================
    // RECALL
    // =================================

    if (questionType === 0) {

        questionText =
            `What was the number at the ${prettyPosition(position1)}?`;


        correctAnswer =
            value1;

    }


    // =================================
    // SUM
    // =================================

    else {

        questionText =
            `What is the ${prettyPosition(position1)} number + the ${prettyPosition(position2)} number?`;


        correctAnswer =
            value1 + value2;

    }


    currentQuestionData = {

        type: questionType,

        position1,

        position2,

        value1,

        value2,

        questionText,

        correctAnswer

    };


    document
        .getElementById("question")
        .textContent =
        questionText;


    /*
        Create answer field
    */

    document
        .getElementById("answer-area")
        .innerHTML = `

            <input
                type="number"
                id="answer-input"
                placeholder="Your answer"
                autocomplete="off"
            >

        `;


    document
        .getElementById("submit-btn")
        .classList
        .remove("hidden");


    const input =
        document.getElementById(
            "answer-input"
        );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                checkAnswer();

            }

        }
    );


    input.focus();

}


// =====================================
// POSITION NAME
// =====================================

function prettyPosition(position) {

    return position

        .replace("-", " ")

        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


// =====================================
// CHECK ANSWER
// =====================================

function checkAnswer() {

    const input =
        document.getElementById(
            "answer-input"
        );


    if (
        !input ||
        input.value === ""
    ) {

        return;

    }


    const userAnswer =
        Number(input.value);


    totalQuestions++;


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (
        userAnswer ===
        currentQuestionData.correctAnswer
    ) {

        correctAnswers++;


        /*
            10 points normally.
            5 points if hint was used.
        */

        const points =
            hintUsed ? 5 : 10;


        score += points;


        document
            .getElementById(
                "score-display"
            )
            .textContent =
            score;


        feedback.textContent =
            `Correct! +${points} points`;

    }

    else {

        feedback.textContent =
            `Not quite! The correct answer was ${currentQuestionData.correctAnswer}.`;

    }


    input.disabled = true;


    finishQuestionButtons();


    setTimeout(() => {

        nextQuestion();

    }, 1700);

}


// =====================================
// HINT BUTTON
// =====================================

document
    .getElementById("hint-btn")
    .addEventListener(
        "click",
        showHint
    );


// =====================================
// SHOW HINT
// =====================================

function showHint() {

    if (!currentQuestionData) {

        return;

    }


    hintUsed = true;


    const hintArea =
        document.getElementById(
            "hint-area"
        );


    /*
        ================================
        RECALL HINT
        ================================
    */

    if (
        currentQuestionData.type === 0
    ) {

        const x =
            currentQuestionData.value1;


        /*
            Random number from 1 to 10.

            We intentionally avoid 0 because
            x + 0 = x would give away too much.
        */

        const randomNumber =
            Math.floor(
                Math.random() * 10
            ) + 1;


        /*
            Randomly choose + or -

            For subtraction:

            randomNumber <= x

            so the result never becomes negative.
        */

        const useAddition =
            Math.random() < 0.5;


        let equation;


        if (useAddition) {

            const result =
                x + randomNumber;


            equation =
                `x + ${randomNumber} = ${result}`;

        }

        else {

            /*
                If x is small, subtraction
                still needs to remain valid.
            */

            const safeNumber =
                Math.min(
                    randomNumber,
                    x
                );


            const result =
                x - safeNumber;


            equation =
                `x − ${safeNumber} = ${result}`;

        }


        hintArea.innerHTML = `

            <strong>💡 Hint</strong>

            <br>

            Try solving this equation:

            <div class="hint-equation">
                ${equation}
            </div>

            <br>

            Find <strong>x</strong>!

        `;

    }


    /*
        ================================
        SUM HINT
        ================================
    */

    else {

        const value1 =
            currentQuestionData.value1;


        const value2 =
            currentQuestionData.value2;


        const representation1 =
            powerOfTwoRepresentation(
                value1
            );


        const representation2 =
            powerOfTwoRepresentation(
                value2
            );


        hintArea.innerHTML = `

            <strong>💡 Hint</strong>

            <br><br>

            <strong>
                Number 1
            </strong>

            =
            <div class="hint-equation">
                ${representation1}
            </div>

            <br>

            <strong>
                Number 2
            </strong>

            =
            <div class="hint-equation">
                ${representation2}
            </div>

            <br>

            Work out both numbers,
            then add them together.

        `;

    }


    hintArea.classList.add(
        "visible"
    );

}


// =====================================
// POWER OF TWO REPRESENTATION
// =====================================

function powerOfTwoRepresentation(
    number
) {

    /*
        Find the largest power of 2
        that is <= number.
    */

    let exponent =
        Math.floor(
            Math.log2(number)
        );


    let power =
        Math.pow(
            2,
            exponent
        );


    let remainder =
        number - power;


    /*
        Examples:

        13 → 2^3 + 5
        8  → 2^3 + 0
        17 → 2^4 + 1
    */

    return `2<sup>${exponent}</sup> + ${remainder}`;

}


// =====================================
// I DON'T KNOW
// =====================================

document
    .getElementById("dont-know-btn")
    .addEventListener(
        "click",
        dontKnow
    );


function dontKnow() {

    totalQuestions++;


    const feedback =
        document.getElementById(
            "feedback"
        );


    feedback.textContent =
        `The correct answer was ${currentQuestionData.correctAnswer}.`;


    finishQuestionButtons();


    setTimeout(() => {

        nextQuestion();

    }, 1800);

}


// =====================================
// SUBMIT BUTTON
// =====================================

document
    .getElementById("submit-btn")
    .addEventListener(
        "click",
        checkAnswer
    );


// =====================================
// FINISH QUESTION
// =====================================

function finishQuestionButtons() {

    document
        .getElementById("submit-btn")
        .classList
        .add("hidden");


    document
        .getElementById("hint-btn")
        .classList
        .add("hidden");


    document
        .getElementById("dont-know-btn")
        .classList
        .add("hidden");

}


// =====================================
// NEXT LEVEL
// =====================================

function nextLevel() {

    currentLevel++;


    if (
        currentLevel >=
        levels.length
    ) {

        finishGame();

        return;

    }


    document
        .getElementById("question")
        .textContent =
        `Level ${currentLevel + 1} — Get ready...`;


    setTimeout(() => {

        startLevel();

    }, 1200);

}


// =====================================
// FINISH GAME
// =====================================

function finishGame() {

    clearInterval(timerInterval);


    const elapsed =
        Math.floor(
            (Date.now() - gameStartTime) / 1000
        );


    const minutes =
        Math.floor(elapsed / 60)
            .toString()
            .padStart(2, "0");


    const seconds =
        (elapsed % 60)
            .toString()
            .padStart(2, "0");


    const accuracy =
        totalQuestions === 0

            ? 0

            : Math.round(
                (
                    correctAnswers /
                    totalQuestions
                ) * 100
            );


    document
        .getElementById(
            "final-score"
        )
        .textContent =
        score;


    document
        .getElementById(
            "final-accuracy"
        )
        .textContent =
        `${accuracy}%`;


    document
        .getElementById(
            "final-time"
        )
        .textContent =
        `${minutes}:${seconds}`;


    let message;


    if (accuracy >= 80) {

        message =
            "🧠 Memory Master!";

    }

    else if (accuracy >= 60) {

        message =
            "🔍 Smart Thinker!";

    }

    else {

        message =
            "🌱 Keep Practising!";

    }


    document
        .getElementById(
            "final-message"
        )
        .textContent =
        message;


    showScreen(
        "final-screen"
    );

}


// =====================================
// RESTART
// =====================================

document
    .getElementById("restart-btn")
    .addEventListener(
        "click",
        () => {

            clearInterval(
                timerInterval
            );


            currentLevel = 0;

            currentQuestion = 0;

            score = 0;

            correctAnswers = 0;

            totalQuestions = 0;


            document
                .getElementById(
                    "score-display"
                )
                .textContent =
                "0";


            document
                .getElementById(
                    "time-display"
                )
                .textContent =
                "00:00";


            showScreen(
                "start-screen"
            );

        }
    );


// =====================================
// CLEAR GAME AREA
// =====================================

function clearGameArea() {

    document
        .querySelectorAll(
            ".number-slot"
        )
        .forEach(slot =>
            slot.remove()
        );


    document
        .getElementById(
            "answer-area"
        )
        .innerHTML = "";


    document
        .getElementById(
            "feedback"
        )
        .textContent = "";


    document
        .getElementById(
            "hint-area"
        )
        .classList
        .remove("visible");


    document
        .getElementById(
            "hint-area"
        )
        .innerHTML = "";


    document
        .getElementById(
            "hint-btn"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "dont-know-btn"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "submit-btn"
        )
        .classList
        .add("hidden");

}