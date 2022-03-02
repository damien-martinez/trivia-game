var categoriesRequest = new XMLHttpRequest();
var questionsRequest = new XMLHttpRequest();
var $categorySelect = document.querySelector('#category-select');
var $triviaForm = document.querySelector('#trivia-form');
var $questionContainer = document.querySelector('.question-container');
var $setUpContainer = document.querySelector('.container');

var category = '';

categoriesRequest.open('GET', 'https://opentdb.com/api_category.php');

categoriesRequest.responseType = 'json';

categoriesRequest.addEventListener('load', function () {

  for (var i = 1, j = 10; i < categoriesRequest.response.trivia_categories.length; i++, j++) {
    category = categoriesRequest.response.trivia_categories[i].name;
    var $option = document.createElement('option');
    $option.value = j;
    $option.text = category;
    $categorySelect.appendChild($option);

  }
});

categoriesRequest.send();

function submitForm(event) {
  event.preventDefault();
  var difficulty = $triviaForm.elements.difficulty_select.value;
  var numberOfQuestions = $triviaForm.elements.number_of_questions.value;
  var pulledCategory = $triviaForm.elements.category_select.value;

  if (difficulty === '') {
    var apiUrl = 'https://opentdb.com/api.php?' + 'amount=' + numberOfQuestions + '&category=' + pulledCategory + '&type=multiple';
  } else {
    apiUrl = 'https://opentdb.com/api.php?' + 'amount=' + numberOfQuestions + '&category=' + pulledCategory + '&difficulty=' + difficulty + '&type=multiple';
  }

  questionsRequest.open('GET', apiUrl);
  questionsRequest.responseType = 'json';

  function getTrivia() {
    var triviaObj = questionsRequest.response;

    if (questionsRequest.status === 200) {
      seeQuestions(triviaObj);
    }

  }

  questionsRequest.addEventListener('load', getTrivia);

  questionsRequest.send();

}

$triviaForm.addEventListener('submit', submitForm);

function seeQuestions(triviaObj) {
  $setUpContainer.setAttribute('class', 'hidden');
  $questionContainer.setAttribute('class', 'question-container');
  var results = triviaObj.results;

  for (var i = 0; i < results.length; i++) {

    var $paragraph = document.createElement('p');
    $paragraph.textContent = 'Question: ' + results[i].question;

    var $questionAnswerDiv = document.createElement('div');
    $questionAnswerDiv.appendChild($paragraph);
    $questionContainer.appendChild($questionAnswerDiv);

    var $choice1 = document.createElement('p');
    var $choice2 = document.createElement('p');
    var $choice3 = document.createElement('p');
    var $choice4 = document.createElement('p');

    $choice1.textContent = 'A. ' + results[i].correct_answer;
    $choice2.textContent = 'B. ' + results[i].incorrect_answers[0];
    $choice3.textContent = 'C. ' + results[i].incorrect_answers[1];
    $choice4.textContent = 'D. ' + results[i].incorrect_answers[2];

    $questionAnswerDiv.appendChild($choice1);
    $questionAnswerDiv.appendChild($choice2);
    $questionAnswerDiv.appendChild($choice3);
    $questionAnswerDiv.appendChild($choice4);

    $questionContainer.appendChild($questionAnswerDiv);

  }

}
