/* exported dataModel */
var dataModel = {
  choiceArr: [],
  clicked: '',
  correctAnswer: '',
  correctChoiceDom: {},
  paragraph: {},
  results: [],
  choiceDiv: {},
  count: 8,
  questionDivDom: {},
  submitDivDom: {},
  correctCount: 0,
  playerObj: {},
  player: '',
  questionsRequestData: {}

};

var previousData = localStorage.getItem('localPlayerData');

if (previousData !== null) {
  var parsedData = JSON.parse(previousData);

  dataModel.playerObj = parsedData;
}

function stringifyData(event) {

  var stringifyObj = JSON.stringify(dataModel.playerObj);
  localStorage.setItem('localPlayerData', stringifyObj);
  event.preventDefault();
}

window.addEventListener('beforeunload', stringifyData);
