


function startQuiz(){
    
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
    }
    );

    
    // Savienojam visus HTML outputus vienā virknē, kas sastāv no attiecīgā HTML un izliekam lapā
    quizContainer.innerHTML = output.join('');
}



function showResults(){

    
    // Savācam atbilžu konteinerus no testa
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // Mainīgais, lai saskaitītu pareizās atbildes
    let numCorrect = 0;

    // Iterējam pa jautājumiem
    myQuestions.forEach( (currentQuestion, questionNumber) => {

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
    });

    // Parādam pareizo atbilžu skaitu
    resultsContainer.innerHTML = `${numCorrect} pareizi no ${myQuestions.length}`;
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