


function startQuiz(){
    startTimer();
    startButton.style.display = 'none';
    document.getElementById('intro').style.display = 'none';
    buildQuiz();
    window.slides = document.querySelectorAll(".slide");
    showSlide(currentSlide);
}


function buildQuiz(){
    // Mainīgais HTML outputam
    const output = [];

    // Iterējam pa katru jautājumu
    myQuestions.forEach(
    (currentQuestion, questionNumber) => {
    if(currentQuestion.type === 'selection'){
    // Mainīgais ar visām iespējamām atbildēm
    const answers = [];

    // Iterējam pa katru iespējamo atbildi
    for(letter in currentQuestion.answers){

    // Pievienojam HTML radio button
    answers.push(
    `<label>
    <input type="radio" name="question${questionNumber}" value="${letter}">
    ${letter} :
    ${currentQuestion.answers[letter]}
    </label>`
    );
    }

    // Pievienojam attiecīgo jautājumu un atbildes pie HTML outputa
    output.push(
    `<div class="slide">
    <div class="question"> ${currentQuestion.question} </div>
    <div class="answers"> ${answers.join("")} </div>
    </div>`
    );


    }else if(currentQuestion.type === 'check'){
        const answers = [];

        for(letter in currentQuestion.answers){
            answers.push(
                `<label>
                <input type='checkbox' name="question${questionNumber}" value="${letter}">
                ${letter} : ${currentQuestion.answers[letter]}
                </label>
                `
            )
        }
        output.push(
            `<div class="slide">
            <div class="question"> ${currentQuestion.question} </div>
            <div class="answers"> ${answers.join("")} </div>
            </div>`
            );
    }else if(currentQuestion.type === 'text'){

        output.push(
            `<div class="slide">
            <div class="question"> ${currentQuestion.question} </div>
            <div class="answers"> <input type='text' name="question${questionNumber}"></div>
            </div>`
        )

    } else if(currentQuestion.type === 'drop'){
        const answers = [];
        answerString = `<select name="question${questionNumber}">`;
        for(letter in currentQuestion.answers){
            // console.log(currentQuestion.answers[letter]);
            // console.log(letter);
            answerString += ` <option value="${currentQuestion.answers[letter]}">${currentQuestion.answers[letter]}</option>`;
        }
        answerString += `</select>`

        for(letter in currentQuestion.correctAnswers){
        answers.push(
            `<label>
            ${letter} :
            ${answerString}
            </label>`
        );
        }
        output.push(
            `<div class="slide">
            <div class="question"> ${currentQuestion.question} </div>
            <div class="answers"> ${answers.join('')}</div>
            </div>`
        );

    }

    }
    );

    
    // Savienojam visus HTML outputus vienā virknē un izliekam lapā
    quizContainer.innerHTML = output.join('');
}



function showResults(){
    stopTimer();
    
    // Savācam atbilžu konteinerus no testa
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // Mainīgais, lai saskaitītu pareizās atbildes
    let numCorrect = 0;

    // Iterējam pa jautājumiem
    myQuestions.forEach( (currentQuestion, questionNumber) => {
        if(currentQuestion.type === 'selection'){
        // Atrodam atzīmēto atbildi
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        // Ja atbilde pareiza
        if(userAnswer === currentQuestion.correctAnswer){
        // Pieskaitam pareizu atbildi
            numCorrect++;

        // Iekrāsojam pareizās atbildes zaļas
            answerContainers[questionNumber].style.color = 'lightgreen';
        }
        // Ja atbilde ir nepareiza vai tukša
        else{
        // Iekrāsojam nepareizās atbildes sarkanas
            answerContainers[questionNumber].style.color = 'red';
        }
    }
    else if(currentQuestion.type === 'check'){
        const userAnswers = [];
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswerContainers = answerContainer.querySelectorAll(selector);
        userAnswerContainers.forEach(element => {
            userAnswers.push(element.value);
        });
        const correctAnswers = new Array();
        for(ans in currentQuestion.correctAnswers){
            correctAnswers.push(currentQuestion.correctAnswers[ans]);
        }
        
        ansValue = 1/correctAnswers.length;
        
        const selector1 = "label";
        const selector2 ="input";
        const labels = answerContainer.querySelectorAll(selector1);
        const answers = [];
        labels.forEach(ans => {
            // ans.style.color = "red"; 
            answers.push(ans.querySelector(selector2));
        });
        


        for(i = 0; i<userAnswerContainers.length;i++){
           
            var iscorrect = false;
            for(ans in correctAnswers){
                // console.log("correct answer:"+correctAnswers[ans]);
                if(userAnswerContainers[i].value === correctAnswers[ans]){
                    iscorrect = true;
                    break;
                }else{
                    iscorrect = false;
                }
            }
            if (iscorrect){
                userAnswerContainers[i].parentElement.style.color='lightgreen';
                    console.log('Success');
                    numCorrect += ansValue;
            }else{
                userAnswerContainers[i].parentElement.style.color = 'red';
                numCorrect -= ansValue;
            }

            
        }



    } else if(currentQuestion.type === 'text'){
        const answerContainer = answerContainers[questionNumber];
        const selector = 'input';
        const userAnswer = answerContainer.querySelector(selector);
        if(userAnswer.value === currentQuestion.correctAnswer){
            userAnswer.style.backgroundColor = 'lightgreen';
            numCorrect++;
        }else{
            userAnswer.style.backgroundColor = 'red';
        }



    } else if(currentQuestion.type === 'drop'){
        const answerContainer = answerContainers[questionNumber];
        const selector = 'select';
        const userAnswers = answerContainer.querySelectorAll(selector);
        const correctAnswers = currentQuestion.correctAnswers;
        const ansValue = 1/userAnswers.length;

        i = 0;
        for(ans in correctAnswers){
            if(userAnswers[i].value === currentQuestion.correctAnswers[ans]){
                console.log('Correct!');
                userAnswers[i].style.backgroundColor = 'lightgreen';
                numCorrect += ansValue;
                i++;
            }else{
                console.log('Not correct');
                userAnswers[i].style.backgroundColor = 'red';
                i++;
            }
        }

    }



    });
    // Parādam pareizo atbilžu skaitu
    resultsContainer.innerHTML = `Iegūti ${numCorrect.toFixed(2)} punkti no ${myQuestions.length}`;
    // Noņemam iesniegšanas pogu, lai lietotājs nevar iesniegt testu atkārtoti
    submitButton.remove();
    // Parādam restartēšanas pogu
    restartButton.style.display = 'inline-block';
}



function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;
    if(currentSlide === 0){
        previousButton.style.display = 'none';
    }
    else{
        previousButton.style.display = 'inline-block';
    }
    if(currentSlide === slides.length-1){
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
    }
    else{
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }
}

function showNextSlide() {
    showSlide(currentSlide + 1);
}

function showPreviousSlide() {
    showSlide(currentSlide - 1);
}

// Variables
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');




myQuestions = new Array();


// Pagination
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
let currentSlide = 0;

(function(){
    previousButton.style.display = 'none';
    nextButton.style.display = 'none';
    submitButton.style.display = 'none';
    restartButton.style.display = 'none';
})();


function restart(){
    location.reload();
}


function loadQuestions(){
    $.getJSON('questions.json', function(data){
        myQuestions = data.questions;
        console.log(myQuestions)
    }).error(function(){
        console.log('error: json not loaded');
    });

}
loadQuestions();

// Event listeners
submitButton.addEventListener('click', showResults);
previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);
restartButton.addEventListener("click", restart);
startButton.addEventListener("click", startQuiz)