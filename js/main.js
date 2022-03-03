/* global dataModel */

var categoriesRequest = new XMLHttpRequest();
var questionsRequest = new XMLHttpRequest();
var $categorySelect = document.querySelector('#category-select');
var $triviaForm = document.querySelector('#trivia-form');
var $questionContainer = document.querySelector('.question-container');
var $setUpContainer = document.querySelector('.container');

window.addEventListener('load', function () {

  categoriesRequest.open('GET', 'https://opentdb.com/api_category.php');

  categoriesRequest.responseType = 'json';

  categoriesRequest.addEventListener('load', function () {

    for (var i = 1, j = 10; i < categoriesRequest.response.trivia_categories.length; i++, j++) {
      var category = '';
      category = categoriesRequest.response.trivia_categories[i].name;
      var $option = document.createElement('option');
      $option.value = j;
      $option.text = category;
      $categorySelect.appendChild($option);

    }
  });
  categoriesRequest.send();
});

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

  dataModel.results = triviaObj.results;

  var results = dataModel.results;

  var correctAnswer = results[0].correct_answer;

  dataModel.correctAnswer = correctAnswer;

  var choicesArr = [correctAnswer, results[0].incorrect_answers[0], results[0].incorrect_answers[1], results[0].incorrect_answers[2]];
  var num = 3;

  var $questionDiv = document.createElement('div');
  $questionDiv.setAttribute('class', 'row');
  $questionContainer.appendChild($questionDiv);

  var $h1 = document.createElement('h1');
  $h1.setAttribute('class', 'question');
  $h1.textContent = 'Question: ' + results[0].question;
  $questionDiv.appendChild($h1);

  var $choiceDiv = document.createElement('div');
  $choiceDiv.setAttribute('class', 'row flex-wrap margin-top-head');
  $questionContainer.appendChild($choiceDiv);

  var $questionDiv1 = document.createElement('div');
  var $questionDiv2 = document.createElement('div');
  var $questionDiv3 = document.createElement('div');
  var $questionDiv4 = document.createElement('div');

  $questionDiv1.setAttribute('class', 'column-half');
  $questionDiv2.setAttribute('class', 'column-half');
  $questionDiv3.setAttribute('class', 'column-half');
  $questionDiv4.setAttribute('class', 'column-half');

  $choiceDiv.appendChild($questionDiv1);
  $choiceDiv.appendChild($questionDiv2);
  $choiceDiv.appendChild($questionDiv3);
  $choiceDiv.appendChild($questionDiv4);

  var $p1 = document.createElement('p');
  var $p2 = document.createElement('p');
  var $p3 = document.createElement('p');
  var $p4 = document.createElement('p');

  $p1.setAttribute('class', 'choice');
  $p2.setAttribute('class', 'choice');
  $p3.setAttribute('class', 'choice');
  $p4.setAttribute('class', 'choice');

  $p1.setAttribute('id', 'one');
  $p2.setAttribute('id', 'two');
  $p3.setAttribute('id', 'three');
  $p4.setAttribute('id', 'four');

  $questionDiv1.appendChild($p1);
  $questionDiv2.appendChild($p2);
  $questionDiv3.appendChild($p3);
  $questionDiv4.appendChild($p4);

  var $choice1 = document.createElement('span');
  var $choice2 = document.createElement('span');
  var $choice3 = document.createElement('span');
  var $choice4 = document.createElement('span');

  var randomInt = Math.floor(Math.random() * num);
  if (choicesArr[randomInt] === correctAnswer) {
    $choice1.textContent = choicesArr[randomInt];
    choicesArr.splice(randomInt, 1);
    num--;

    dataModel.correctChoiceDom = $p1;
  } else {
    $choice1.textContent = choicesArr[randomInt];
    choicesArr.splice(randomInt, 1);
    num--;

  }

  randomInt = Math.floor(Math.random() * num);

  if (choicesArr[randomInt] === correctAnswer) {
    $choice2.textContent = choicesArr[randomInt];
    choicesArr.splice(randomInt, 1);
    num--;

    dataModel.correctChoiceDom = $p2;
  } else {
    $choice2.textContent = choicesArr[randomInt];
    choicesArr.splice(randomInt, 1);
    num--;

  }

  randomInt = Math.floor(Math.random() * num);

  if (choicesArr[randomInt] === correctAnswer) {
    $choice3.textContent = choicesArr[randomInt];
    choicesArr.splice(randomInt, 1);
    num--;

    dataModel.correctChoiceDom = $p3;
  } else {
    $choice3.textContent = choicesArr[randomInt];
    choicesArr.splice(randomInt, 1);
    num--;

  }

  if (choicesArr[randomInt] === correctAnswer) {
    $choice4.textContent = choicesArr[0];

    dataModel.correctChoiceDom = $p4;
  } else {
    $choice4.textContent = choicesArr[0];

  }

  var $a = document.createElement('span');
  var $b = document.createElement('span');
  var $c = document.createElement('span');
  var $d = document.createElement('span');

  $a.textContent = 'A:';
  $b.textContent = 'B:';
  $c.textContent = 'C:';
  $d.textContent = 'D:';

  $a.setAttribute('class', 'float-left');
  $b.setAttribute('class', 'float-left');
  $c.setAttribute('class', 'float-left');
  $d.setAttribute('class', 'float-left');

  $p1.appendChild($choice1);
  $p2.appendChild($choice2);
  $p3.appendChild($choice3);
  $p4.appendChild($choice4);

  $p1.prepend($a);
  $p2.prepend($b);
  $p3.prepend($c);
  $p4.prepend($d);

  var $submitDiv = document.createElement('div');
  $submitDiv.setAttribute('class', 'row center');

  $questionContainer.appendChild($submitDiv);

  var $submit = document.createElement('button');

  $submit.textContent = 'Submit';

  $submit.setAttribute('class', 'submit');

  $submitDiv.appendChild($submit);

  $choiceDiv.addEventListener('click', clickAnswer);
  $submitDiv.addEventListener('click', submitAnswer);

  dataModel.choiceDiv = $choiceDiv;
  dataModel.submitDiv = $submitDiv;

}

function clickAnswer(event) {

  var $paragraph = event.target.closest('p');
  var $spanNodes = $paragraph.childNodes;
  dataModel.clicked = $spanNodes[1].textContent;
  dataModel.paragraph = $paragraph;

  for (var i = 0; i < dataModel.choiceDiv.childNodes.length; i++) {

    dataModel.choiceDiv.childNodes[i].firstChild.setAttribute('class', 'choice');

    if (dataModel.choiceDiv.childNodes[i].firstChild === $paragraph) {
      dataModel.choiceDiv.childNodes[i].firstChild.setAttribute('class', 'choice border-highlight');

    }

  }
}

function submitAnswer(event) {

  if (dataModel.clicked === dataModel.correctAnswer) {
    dataModel.paragraph.setAttribute('class', 'choice green');
  } else {
    dataModel.paragraph.setAttribute('class', 'choice red');
    dataModel.correctChoiceDom.setAttribute('class', 'choice green');
  }
}
