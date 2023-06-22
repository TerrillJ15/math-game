$(document).ready(function () {
  /** Current question object containing the answer and the equation to display. */
  var currentQuestion;

  /** The selected operands that generated equations may use:  add; subtract; multiply; divide */
  var selectedOperands = ['add'];

  /** Current timer value in seconds. */
  var timer = 0;

  /** Holds the reference to the interval running every second. */
  var interval;

  /** The current score. */
  var score = 0;

  /** The high score the user currently has. Will be loaded from the local storage. */
  var highScore = parseInt(localStorage.getItem('math-game-high-score'));
  if (Number.isNaN(highScore)) {
    highScore = 0;
  }
  $('#high-score').text(highScore);

  /** The highest number that can be generated for equations. */
  var numberLimit = 10;

  /**
   * Performs the timer update when the second interval occurs.
   * Will subtract a second from the timer and display it.
   * If the timer reaches 0, then the game is over.
   */
  var performInterval = function () {
    updateTimer(-1);
    if (timer === 0) {
      clearInterval(interval);
      interval = undefined;
      showPlayAgain();
    }
  };

  /**
   * Timer will start at the beginning of the game.
   * The timer will start at 10 seconds.
   * The score will reset to 0 for each round played.
   */
  var startGame = function () {
    if (!interval) {
      showGame();
      updateTimer(10);
      updateScore(-score);
      interval = setInterval(performInterval, 1000);
      $('#answer-input').val('');
    }
  };

  /**
   * Displays the game entry screen when the game has started.
   */
  var showGame = function () {
    $('#menu').hide();
    $('#game').show();
    $('#answer-input').focus();
    renderNewQuestion();
  };

  /**
   * Displays the play again screen when the game is over.
   */
  var showPlayAgain = function () {
    $('#menu').show();
    $('#game').hide();
    $('#message').text('Game Over! Please play again.');
  };

  /**
   * Updates the timer value by increasing it by the provided amount.
   * The timer value on the UI is updated to reflect the new value.
   *
   * @param {number} amount The provided amount to add to the timer in seconds.
   */
  var updateTimer = function (amount) {
    timer += amount;
    $('#timer').text(timer);
  };

  /**
   * Updates the score by the provided amount.
   * The UI is updated to reflect the new score.
   * If the current score exceeds the high score,
   * then update the high score and display it.
   * The high score will be stored in local storage.
   *
   * @param {number} amount The amount to add to the score.
   */
  var updateScore = function (amount) {
    score += amount;
    $('#score').text(score);
    if (score > highScore) {
      highScore = score;
      $('#high-score').text(highScore);
      localStorage.setItem('math-game-high-score', highScore);
    }
  };

  /**
   * Generates a random number for the equations.
   *
   * @param {number} size The largest number value that can be generated.
   * @returns The generated random number between 1 and the max size.
   */
  var numberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  };

  /**
   * Generates the question object for the current question.
   * Will include the 'equation' to display and the 'answer' of the equation.
   * Equations will randomly use one of the operands selected.
   * Numbers will be generated based on the number limit.
   * Only positive whole numbers will be allowed as answers.
   *
   * @returns The generated equation object containing a 'question' string and 'answer' number.
   */
  var questionGenerator = function () {
    // get random equation type to use from selection
    var operandSeed = Math.floor(Math.random() * selectedOperands.length);
    var operand = selectedOperands[operandSeed];

    // build the question
    var question = {};

    // loop until a valid equation is built
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
          valid = question.answer > 0; // do not allow negative answers
          break;
        case 'multiply':
          type = 'x';
          question.answer = num1 * num2;
          valid = true;
          break;
        case 'divide':
          type = '/';
          question.answer = num1 / num2;
          valid = Number.isInteger(question.answer); // do not allow non-whole number answers
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

  /**
   * Renders a new equation on the game screen.
   */
  var renderNewQuestion = function () {
    currentQuestion = questionGenerator();
    $('#equation').text(currentQuestion.equation);
  };

  /**
   * Compares the user input with the correct answer.
   * If the answer is correct the game will generate a new question,
   * update the timer by 1 second, and increase the score by 1 point.
   * The answer field will be cleared as well.
   *
   * @param {number} userInput User inputted number value to check.
   * @param {number} answer The answer to compare the user input with.
   */
  var checkAnswer = function (userInput, answer) {
    if (userInput === answer) {
      renderNewQuestion();
      $('#answer-input').val('');
      updateTimer(+1);
      updateScore(+1);
    }
  };

  /** Check the answer when the user types into the text field. */
  $('#answer-input').on('keyup', function () {
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  /** Handles when enter is pressed to start the game when it hasn't been started already. */
  $(document).on('keyup', function (event) {
    if (event.key === 'Enter' && timer === 0) {
      startGame();
    }
  });

  /** Handles when the start button is clicked to start the game. */
  $('#btn-start').click(function () {
    startGame();
  });

  /**
   * Updates the selected operands. If the checkbox is checked,
   * then make sure the operand is in the selected operands array.
   * If the checkbox is unchecked, then remove the operand
   * from the selected operands array.
   *
   * @param {string} operand The name of the operand to get the checked state for and select if checked.
   */
  var updateOperands = function (operand) {
    var checked = $(`#${operand}`).is(':checked');
    if (checked) {
      selectedOperands.push(operand);
    } else {
      selectedOperands = selectedOperands.filter(o => o !== operand);
    }
  };

  // add click listeners to the operand checkboxes to update the selected operands array based on the new checked state
  $('#add').click(() => updateOperands('add'));
  $('#subtract').click(() => updateOperands('subtract'));
  $('#multiply').click(() => updateOperands('multiply'));
  $('#divide').click(() => updateOperands('divide'));

  /** Handles when the number limit slider is updated to update the internal value used and display the value on the UI. */
  $('#number-limit-slider').on('input', function () {
    numberLimit = $('#number-limit-slider').val();
    $('#number-limit').html(numberLimit);
  });
});
