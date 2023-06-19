$(document).ready(function () {
  var currentQuestion;
  var timer = 10;

  var interval = setInterval(function () {
    updateTimer(-1);
    if (timer === 0) {
      clearInterval(interval);
    }
  }, 1000);

  var updateTimer = function (amount) {
    timer += amount;
    $('#timer').text(timer);
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
    }
  };

  $('#answer-input').on('keyup', function () {
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  renderNewQuestion();
});
