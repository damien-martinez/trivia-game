var categoriesRequest = new XMLHttpRequest();
var questionsRequest = new XMLHttpRequest();
var $categorySelect = document.querySelector('#category-select');
var $triviaForm = document.querySelector('#trivia-form');

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

  }

  questionsRequest.addEventListener('load', getTrivia);

  questionsRequest.send();

}

$triviaForm.addEventListener('submit', submitForm);
