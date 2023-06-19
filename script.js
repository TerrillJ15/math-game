$(document).ready(function () {
  var currentQuestion;

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
  currentQuestion = questionGenerator();
  $('#equation').text(currentQuestion.equation);
});
