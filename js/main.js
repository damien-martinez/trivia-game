var categoriesRequest = new XMLHttpRequest();
var $categorySelect = document.querySelector('#category-select');
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
