$(document).ready(function () {
  var currentQuestion;
  var selectedOperands = ['add']; // add; subtract; multiply; divide
  var timer = 0;
  var interval;
  var score = 0;
  var highScore = 0;
  var numberLimit = 10;

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
      $('#answer-input').val('');
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
    if (score > highScore) {
      highScore = score;
      $('#high-score').text(highScore);
    }
  };

  var numberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  };

  var questionGenerator = function () {
    // get random equation type to use from selection
    var operandSeed = Math.floor(Math.random() * selectedOperands.length);

    var operand = selectedOperands[operandSeed];

    var question = {};

    var num1;
    var num2;
    var type;
    var valid = false;
    while (!valid) {
      num1 = numberGenerator(numberLimit);
      num2 = numberGenerator(numberLimit);
      switch (operand) {
        case 'subtract':
          type = '-';
          question.answer = num1 - num2;
          valid = question.answer > 0;
          break;
        case 'multiply':
          type = 'x';
          question.answer = num1 * num2;
          valid = true;
          break;
        case 'divide':
          type = '/';
          question.answer = num1 / num2;
          valid = Number.isInteger(question.answer);
          break;
        default:
          type = '+';
          question.answer = num1 + num2;
          valid = true;
      }
    }
    question.equation = `${num1} ${type} ${num2}`;

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

  var updateOperands = function (operand) {
    var checked = $(`#${operand}`).is(':checked');
    if (checked) {
      selectedOperands.push(operand);
    } else {
      selectedOperands = selectedOperands.filter(o => o !== operand);
    }
  };

  $('#add').click(() => updateOperands('add'));
  $('#subtract').click(() => updateOperands('subtract'));
  $('#multiply').click(() => updateOperands('multiply'));
  $('#divide').click(() => updateOperands('divide'));

  $('#number-limit-slider').on('input', function () {
    numberLimit = $('#number-limit-slider').val();
    $('#number-limit').html(numberLimit);
  });
});
