const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const feedback = document.getElementById('feedback');
const previousGuesses = document.getElementById('previousGuesses');
const giveupButton = document.getElementById('giveupButton');
const leastAttempts = document.getElementById('leastattempts');
const mostAttempts = document.getElementById('mostattempts');
const resetAttemptsButton = document.getElementById('resetAttemptsButton');
const backgroundMusic = document.getElementById('music');
const giveUpSound = document.getElementById('giveup');
const deleterecordSound = document.getElementById('deleterecord');
var resetSound = document.getElementById('playagain');

// Hide the reset button initially. Only show it when the game is over
;

// Fetch the initial game state
function fetchGameState() {
  fetch('/api/game')
    .then(response => response.json())
    .then(data => {
      leastAttempts.textContent = `😍Least attempts: ${data.leastAttempts}`;
      mostAttempts.textContent = `😖Most attempts: ${data.mostAttempts}`;
      if (data.leastAttempts != "No record yet" || data.mostAttempts != "No record yet") {
        resetAttemptsButton.style.display = "inline-block";
      }
    });
}

// Handle the guess submission
function submitGuess() {
  backgroundMusic.play();
  const guess = parseInt(guessInput.value);

  fetch('/api/guess', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ guess }),
  })
    .then(response => response.json())
    .then(data => {
      feedback.textContent = data.feedbackMessage;
      previousGuesses.textContent = `Previous guesses: ${data.guesses.join(', ')}`;
      if (!data.gameWon) {
        guessInput.value = '';
      }
      else {
        giveupButton.style.display = "none";
        guessButton.style.display = "none";
        resetButton.style.display = "inline-block";
        resetButton.textContent = '🙏Play Again?';
        leastAttempts.textContent = `😍Least attempts: ${data.leastAttempts}`;
        mostAttempts.textContent = `😖Most attempts: ${data.mostAttempts}`;
        if (data.leastAttempts != "No record yet" || data.mostAttempts != "No record yet") {
          resetAttemptsButton.style.display = "inline-block";
        }
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
      document.getElementById(data.soundID).play();
      document.getElementById(data.soundID).currentTime = 0;
      guessInput.focus();
    });
}

// Handle the game reset
function resetGame() {
  fetch('/api/reset', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      guessInput.style.display = "inline-block";
      giveupButton.style.display = "inline-block";
      resetButton.style.display = "none";
      giveupButton.style.display = "inline-block";
      guessButton.style.display = "inline-block";
      resetSound.play();
      resetSound.currentTime = 0;
      feedback.textContent = '';
      previousGuesses.textContent = '';
      guessInput.value = '';
      backgroundMusic.currentTime = 0;
      backgroundMusic.play();
      guessInput.focus();
    });
}

// Function to reset the least and most attempts
function resetAttempts() {
  // deleteToggleSound = 
  fetch('/api/reset-attempts', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      leastAttempts.textContent = '😍Least attempts: No record yet';
      mostAttempts.textContent = '😖Most attempts: No record yet';
      console.log(data.message);
      deleterecordSound.play();
      deleterecordSound.currentTime = 0;
      resetAttemptsButton.style.display = "none";
    })
    .catch(err => {
      console.error('Error resetting attempts:', err);
      feedback.textContent = 'An error occurred while resetting attempts.';
    });
}

// Event listeners
guessButton.addEventListener('click', submitGuess);
resetButton.addEventListener('click', resetGame);
guessInput.addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    submitGuess();
  }
});
giveupButton.addEventListener('click', () => {
  fetch('/api/giveup', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      resetButton.style.display = "inline-block";
      feedback.textContent = data.feedbackMessage;
      previousGuesses.textContent = '';
      guessInput.value = '';
      guessInput.focus();
      resetButton.textContent = '🙏Play Again?'
    });
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    giveUpSound.play();
    giveUpSound.currentTime = 0;
});
resetAttemptsButton.addEventListener('click', resetAttempts);
giveupButton.addEventListener('click', () => {
  giveupButton.style.display = "none";
  guessButton.style.display = "none";
});

// Initialize the game state on load
window.onload = fetchGameState;
