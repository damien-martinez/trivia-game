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
  var playerUsedBool = false;
  var player = $triviaForm.elements.name.value;
  var difficulty = $triviaForm.elements.difficulty_select.value;
  var numberOfQuestions = $triviaForm.elements.number_of_questions.value;
  var pulledCategory = $triviaForm.elements.category_select.value;

  dataModel.playerObj[String(player)] = 0;

  for (var property in dataModel.playerObj) {
    if (property === player) {
      playerUsedBool = true;
    }
  }

  if (playerUsedBool === false) {
    dataModel.playerObj[String(player)] = 0;
  }

  if (difficulty === '') {
    var apiUrl = 'https://opentdb.com/api.php?' + 'amount=' + numberOfQuestions + '&category=' + pulledCategory + '&type=multiple';
  } else {
    apiUrl = 'https://opentdb.com/api.php?' + 'amount=' + numberOfQuestions + '&category=' + pulledCategory + '&difficulty=' + difficulty + '&type=multiple';
  }
  questionsRequest.open('GET', apiUrl);
  questionsRequest.responseType = 'json';

  function getTrivia() {
    var results = questionsRequest.response.results;

    dataModel.results = results;

    if (questionsRequest.status === 200) {
      seeQuestions(results);
    }

  }

  questionsRequest.addEventListener('load', getTrivia);

  questionsRequest.send();

}

$triviaForm.addEventListener('submit', submitForm);

function seeQuestions(results) {
  $setUpContainer.setAttribute('class', 'hidden');
  $questionContainer.setAttribute('class', 'question-container');

  var correctAnswer = results[dataModel.count].correct_answer;

  dataModel.correctAnswer = correctAnswer;

  var choicesArr = [correctAnswer, results[dataModel.count].incorrect_answers[0], results[dataModel.count].incorrect_answers[1], results[dataModel.count].incorrect_answers[2]];

  dataModel.choicesArr = choicesArr;

  var $questionDiv = document.createElement('div');
  $questionDiv.setAttribute('class', 'row');
  $questionContainer.appendChild($questionDiv);

  var $h1 = document.createElement('h1');
  $h1.setAttribute('class', 'question');
  $h1.textContent = 'Question: ' + results[dataModel.count].question;
  $questionDiv.appendChild($h1);

  var $score = document.createElement('div');
  $score.setAttribute('class', 'score');
  $score.textContent = (dataModel.count + 1) + '/' + dataModel.results.length;
  $questionContainer.appendChild($score);
  dataModel.scoreDom = $score;

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

  assignAnswer($choice1, $p1);
  assignAnswer($choice2, $p2);
  assignAnswer($choice3, $p3);
  assignAnswer($choice4, $p4);

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
  $submitDiv.setAttribute('class', 'row center margin-top-submit');

  $questionContainer.appendChild($submitDiv);

  var $submit = document.createElement('button');

  $submit.textContent = 'Submit';

  $submit.setAttribute('class', 'submit');

  $submitDiv.appendChild($submit);

  $choiceDiv.addEventListener('click', clickAnswer);

  $submit.addEventListener('click', submitAnswer);

  dataModel.choiceDiv = $choiceDiv;
  dataModel.questionDivDom = $questionDiv;
  dataModel.submitDivDom = $submitDiv;

}

function assignAnswer(choiceParam, paragraphParam) {
  var randomInt = Math.floor(Math.random() * dataModel.choicesArr.length);

  if (dataModel.choicesArr[randomInt] === dataModel.correctAnswer) {
    choiceParam.textContent = dataModel.choicesArr[randomInt];
    dataModel.choicesArr.splice(randomInt, 1);

    dataModel.correctChoiceDom = paragraphParam;
  } else {
    choiceParam.textContent = dataModel.choicesArr[randomInt];
    dataModel.choicesArr.splice(randomInt, 1);
  }
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
  if (dataModel.clicked !== '') {

    if (dataModel.clicked === dataModel.correctAnswer) {
      dataModel.paragraph.setAttribute('class', 'choice green');
      dataModel.correctCount++;
    } else {
      dataModel.paragraph.setAttribute('class', 'choice red');
      dataModel.correctChoiceDom.setAttribute('class', 'choice green');
    }

    setTimeout(triggerSeeQuestions, 500);

  }

}

function triggerSeeQuestions() {
  dataModel.clicked = '';
  dataModel.count++;
  dataModel.choiceDiv.setAttribute('class', 'hidden');
  dataModel.questionDivDom.setAttribute('class', 'hidden');
  dataModel.submitDivDom.setAttribute('class', 'hidden');
  dataModel.scoreDom.setAttribute('class', 'hidden');
  seeQuestions(dataModel.results);

}
