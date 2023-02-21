let countSpan = document.querySelector(".count span");
let BulletsConatiner = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if ((this.readyState === 4) & (this.status == 200)) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            createBullets(questionsCount);

            AddQuestionsData(questionsObject[currentIndex], questionsCount);

            countDown(5, questionsCount);

            submitButton.onclick = () => {
                let RightAnswer = questionsObject[currentIndex].right_answer;

                currentIndex++;

                checkAnswer(RightAnswer, questionsCount);

                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                AddQuestionsData(questionsObject[currentIndex], questionsCount);

                handleBullets();

                clearInterval(countdownInterval);
                countDown(5, questionsCount);

                showResults(questionsCount);
            };
        }
    };
    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if (i === 0) {
            theBullet.className = "on";
        }
        BulletsConatiner.appendChild(theBullet);
    }
}

function AddQuestionsData(obj, count) {
    if (currentIndex < count) {
        let questionsTitle = document.createElement("h2");

        let questionsText = document.createTextNode(obj.title);

        questionsTitle.appendChild(questionsText);

        quizArea.appendChild(questionsTitle);

        for (let j = 1; j <= 4; j++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            let radioInput = document.createElement("input");

            radioInput.name = "question";
            radioInput.id = `answer_${j}`;
            radioInput.type = "radio";
            radioInput.dataset.answer = obj[`answer_${j}`];

            if (j === 1) {
                radioInput.checked = true;
            }

            let TheLabel = document.createElement("label");

            TheLabel.htmlFor = `answer_${j}`;

            let TheLabelText = document.createTextNode(obj[`answer_${j}`]);

            TheLabel.appendChild(TheLabelText);

            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(TheLabel);

            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfspans = Array.from(bulletsSpans);
    arrayOfspans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResults(count) {
    let Results;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if ((rightAnswers > count / 2) & (rightAnswers < count)) {
            Results = `<span class ="good">GOOD</span>, ${rightAnswers} from ${count}`;
        } else if (rightAnswers === count) {
            Results = `<span class ="perfect">Perfect</span>, ${rightAnswers} from ${count}`;
        } else {
            Results = `<span class ="bad">bad</span>, ${rightAnswers} from ${count}`;
        }
        resultsContainer.innerHTML = Results;
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.onclick();
            }
        }, 1000);
    }
}
