const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const feedback = document.getElementById('feedback');
const previousGuesses = document.getElementById('previousGuesses');
const giveupButton = document.getElementById('giveupButton');
const leastAttempts = document.getElementById('leastattempts');
const mostAttempts = document.getElementById('mostattempts');

// Fetch the initial game state
function fetchGameState() {
  fetch('/api/game')
    .then(response => response.json())
    .then(data => {
      previousGuesses.textContent = `Previous guesses: ${data.guesses.join(', ')}`;
    });
}

// Handle the guess submission
function submitGuess() {
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
        resetButton.textContent = 'Play again';
        leastAttempts.textContent = `Least attempts: ${data.leastAttempts}`;
        mostAttempts.textContent = `Most attempts: ${data.mostAttempts}`;
      }
      guessInput.focus();
    });
}

// Handle the game reset
function resetGame() {
  fetch('/api/reset', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      feedback.textContent = '';
      previousGuesses.textContent = '';
      guessInput.value = '';
      resetButton.textContent = 'Reset Game';
      guessInput.focus();
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
      feedback.textContent = data.feedbackMessage;
      previousGuesses.textContent = '';
      guessInput.value = '';
      guessInput.focus();
    });
});

// Initialize the game state on load
window.onload = fetchGameState;
