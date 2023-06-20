$(document).ready(function () {
  var currentQuestion;
  var timer = 0;
  var interval;
  var score = 0;
  var highScore = 0;

  var performInterval = function () {
    updateTimer(-1);
    if (timer === 0) {
      clearInterval(interval);
      interval = undefined;
      showPlayAgain();
    }
  };

  var startGame = function () {
    if (!interval) {
      showGame();
      updateTimer(10);
      updateScore(-score);
      interval = setInterval(performInterval, 1000);
    }
  };

  var showGame = function () {
    $('#menu').hide();
    $('#game').show();
    $('#answer-input').focus();
    renderNewQuestion();
  };

  var showPlayAgain = function () {
    $('#menu').show();
    $('#instructions').hide();
    $('#game').hide();
    $('#message').text('Game Over! Please play again.');
  };

  var updateTimer = function (amount) {
    timer += amount;
    $('#timer').text(timer);
  };

  var updateScore = function (amount) {
    score += amount;
    $('#score').text(score);
  };

  var numberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  };

  var questionGenerator = function () {
    var question = {};
    var num1 = numberGenerator(10);
    var num2 = numberGenerator(10);

    question.answer = num1 + num2;
    question.equation = String(num1) + ' + ' + String(num2);

    return question;
  };

  // ON LOAD
  var renderNewQuestion = function () {
    currentQuestion = questionGenerator();
    $('#equation').text(currentQuestion.equation);
  };

  var checkAnswer = function (userInput, answer) {
    if (userInput === answer) {
      renderNewQuestion();
      $('#answer-input').val('');
      updateTimer(+1);
      updateScore(+1);
    }
  };

  $('#answer-input').on('keyup', function () {
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  $(document).on('keyup', function (event) {
    if (event.key === 'Enter' && timer === 0) {
      startGame();
    }
  });

  $('#btn-start').click(function () {
    startGame();
  });
});
