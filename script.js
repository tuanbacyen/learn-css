$(document).ready(function () {
  addEvent();
  viewShow('start');
  questionButton();
});

function addEvent() {
  $('body').on('click', '#btn-start', start);
  $('body').on('click', '#btn-prev', prev);
  $('body').on('click', '#btn-next', next);
  $('body').on('click', '#btn-submit', submit);
  $('body').on('click', '#btn-review', review);
  $('body').on('click', '#btn-result', result);
  $('body').on('click', '#btn-end', end);
  $('input[type=radio]').on('change', selectAnswer);
  $('body').on('click', '.answer-thumb-item', answerThumbItem);
  $('body').on('click', '.review-answer-item', reviewAnswerItem);
}

function questionButton() {
  if (ACTIVE === LIST.length) {
    $('#btn-submit').prop('disabled', false);
  } else {
    $('#btn-submit').prop('disabled', true);
  }

  if (!Object.values(ANSWER).includes(null)) {
    $('#btn-submit').prop('disabled', false);
  }
}

function start() {
  viewShow('quest');
  INTERVAL = setInterval(timerCountdown, SECONDS);
}

function prev() {
  ACTIVE--;
  if (ACTIVE === 0) {
    ACTIVE = LIST.length;
  }
  questionButton();
  showQuestion('prev');
}

function next() {
  ACTIVE++;
  if (ACTIVE > LIST.length) {
    ACTIVE = 1;
  }
  questionButton();
  showQuestion('next');
}

function submit() {
  if (Object.values(ANSWER).includes(null)) {
    showNoChoice();
  } else {
    if (confirm('Bạn muốn nộp bài không ?')) {
      clearInterval(INTERVAL);
      $(`#q${ACTIVE}`).addClass('box-hide');
      ACTIVE = 1;
      // send ajax
      viewShow('finish');
    }
  }
}

function showQuestion(action) {
  var ques_hide = null;
  if (action === 'next' && ACTIVE === 1) {
    ques_hide = LIST.length;
  } else if (action === 'next') {
    ques_hide = ACTIVE - 1;
  } else if (action === 'prev' && ACTIVE === LIST.length) {
    ques_hide = 1;
  } else {
    ques_hide = ACTIVE + 1;
  }
  const id_show = `#q${ACTIVE}`;
  const id_hide = `#q${ques_hide}`;
  $(id_hide).addClass('box-hide');
  $(id_show).removeClass('box-hide');
}

function selectQuestion(key) {
  const id_show = `#q${key}`;
  const id_hide = `#q${ACTIVE}`;
  ACTIVE = parseInt(key);
  $(id_hide).addClass('box-hide');
  $(id_show).removeClass('box-hide');
}

function timerCountdown() {
  if (TIMER >= 0) {
    showTime(TIMER, '.time-countdown');
    TIMER--;
  } else {
    TIMER = 0;
    clearInterval(INTERVAL);
    disabledAll();
    alert("Hết giờ");
    viewShow('finish');
  }
}

function disabledAll() {
  $('input[type=radio]').prop('disabled', true);
  showNoChoice();
}

function showNoChoice() {
  $.each(ANSWER, function (key, value) {
    if (value === null) {
      $(`.${key}`).addClass('no-choice')
    }
  });
}

function selectAnswer() {
  ANSWER[`q${ACTIVE}`] = this.value;
  const answer = $(`#a${ACTIVE}`);
  answer.text(this.value.toString().toUpperCase());
  answer.parent().removeClass('no-choice');
  const parent_ques = $(this).closest('.answer');
  const parent_answer = $(this).closest('.answer-item');
  parent_ques.find('.answer-select').removeClass('answer-select');
  parent_answer.addClass('answer-select');
  questionButton();
}

function answerThumbItem() {
  selectQuestion($(this).children(0)[0].textContent);
  questionButton();
}

function reviewAnswerItem() {
  if (!REVIEW) { return };
  selectQuestion($(this).children(0)[0].textContent);
}

function viewShow(view) {
  switch (view) {
    case 'start':
      $('.container-start').removeClass('box-hide');
      $('.container-question').addClass('box-hide');
      $('.container-finish').addClass('box-hide');
      break;
    case 'quest':
      showQuestion('');
      $('.container-start').addClass('box-hide');
      $('.container-question').removeClass('box-hide');
      $('.container-finish').addClass('box-hide');
      break;
    case 'finish':
      $('.container-start').addClass('box-hide');
      $('.container-question').addClass('box-hide');
      $('.container-finish').removeClass('box-hide');
      showResult();
      break;
    case 'review':
      showQuestion('');
      $('.container-start').addClass('box-hide');
      $('.container-question').removeClass('box-hide');
      $('.container-finish').addClass('box-hide');
      showResult();
      break;
  }
}

function resultExam() {
  var result_correct = {};
  var result_fail = {};
  $.each(CORRECT_ANSWER, function (key, value) {
    if (value === ANSWER[key]) {
      result_correct[key] = value;
    } else {
      result_fail[key] = value;
    }
  });
  return { correct: result_correct, fail: result_fail };
}

function showReviewResult(element) {
  var review_answer = "";
  var i = 1;
  $.each(ANSWER, function (key, value) {
    var class_answer = "wrong-answer";
    if (value === CORRECT_ANSWER[key]) {
      class_answer = "correct-answer";
    }
    var answer_item = `<div class="review-answer-thumb">\
              <div class="review-answer-item ${class_answer}">\
                <span class="">${i}</span>\
                <span id="">${value}</span>\
              </div>\
            </div>`;
    review_answer += answer_item
    i++;
  });
  const answer_element = $(element);
  answer_element.text('');
  answer_element.append(review_answer);
}

function showResult() {
  const count_correct = Object.keys(resultExam().correct).length;
  showTime(TOTAL_TIMER - TIMER, '#time-doing');
  $('#point-result').text(`${count_correct} / ${LIST.length}`)
  showReviewResult('.review-answer');
}

function showTime(time, element) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  $(element).text(`${minutes}:${seconds}`);
}

function review() {
  REVIEW = true;
  viewShow('review');
  $('.timer-box, .answer-question, #btn-submit').remove();
  $('#btn-result').removeClass('box-hide');
  $.each(resultExam().fail, function (key, value) {
    $(`#${key}`).find(`input[type="radio"][value="${value}"]`).parent().parent().addClass('answer-correct');
  });
  showReviewResult('.review-question-answer');
}

function result() {
  REVIEW = false;
  viewShow('finish');
}

function end() {
  if (confirm('Bạn muốn kết thúc không ?')) {
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx');
  }
}
