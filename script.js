$(document).ready(function () {
  addEvent();
  viewShow('start');
  questionButton();
  showQuestion('next');
});

function addEvent() {
  $('body').on('click', '#btn-start', start);
  $('body').on('click', '#btn-prev', prev);
  $('body').on('click', '#btn-next', next);
  $('body').on('click', '#btn-submit', submit);
  $('input[type=radio]').on('change', selectAnswer);
  $('body').on('click', '.answer-thumb-item', function () {
    selectQuestion($(this).children(0)[0].textContent);
    questionButton();
  });
}

function questionButton() {
  $('#btn-submit').prop('disabled', true);
  if (ACTIVE === 1) {
    $('#btn-prev').prop('disabled', true);
    $('#btn-next').prop('disabled', false);
  } else if (ACTIVE === LIST.length) {
    $('#btn-next').prop('disabled', true);
    $('#btn-prev').prop('disabled', false);
    $('#btn-submit').prop('disabled', false);
  } else {
    $('#btn-prev').prop('disabled', false);
    $('#btn-next').prop('disabled', false);
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
  questionButton();
  showQuestion('prev');
}

function next() {
  ACTIVE++;
  questionButton();
  showQuestion('next');
}

function submit() {
  if (Object.values(ANSWER).includes(null)) {
    showNoChoice();
  } else {
    if (confirm('Bạn muốn nộp bài không ?')) {
      clearInterval(INTERVAL);
      console.log('Yessssssssssssssssssss');
      viewShow('finish');
    } else {
      console.log('nooooooooooooooooooooooooo');
    }
  }
}

function showQuestion(action) {
  var ques = +1;
  if (action === 'next') {
    ques = -1;
  }
  const id_show = `#q${ACTIVE}`;
  const id_hide = `#q${ACTIVE + ques}`;
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
    const minutes = Math.floor(TIMER / 60);
    let seconds = TIMER % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    $('.time-countdown').text(`${minutes}:${seconds}`);
    TIMER--;
  } else {
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

function viewShow(view) {
  switch (view) {
    case 'start':
      $('.container-start').removeClass('box-hide');
      break;
    case 'quest':
      $('.container-start').addClass('box-hide');
      $('.container-question').removeClass('box-hide');
      break;
    case 'finish':
      $('.container-question').addClass('box-hide');
      $('.container-finish').removeClass('box-hide');
      break;
  }
}
