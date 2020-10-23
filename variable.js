var LIST = [];
var ACTIVE = 1;
var ANSWER = {};
var TIMER = 0;
var TOTAL_TIMER = 0;
var INTERVAL = null;
var SECONDS = 1000;
var CORRECT_ANSWER = {};
var REVIEW = false;

function random_answer(length) {
  for (var i = 1; i <= 11; i++) {
    const key = `q${i}`;
    const correct = ["A", "B", "C", "D"];
    CORRECT_ANSWER[key] = correct[Math.floor(Math.random() * correct.length)];
  }
}
