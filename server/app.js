// /server/app.js

const express = require('express');
const path = require('path');
const app = express();

let targetNumber;
let guessCount;
let guesses;
let gameWon = false;
let giveUp = false;
let round = 1;

// Initialize a new game
function initGame() {
  giveUp = false;
  gameWon = false;
  targetNumber = Math.floor(Math.random() * 2001) - 1000;
  guessCount = 1;
  guesses = [];
  console.log('Target Number:', targetNumber); // For debugging purposes
}

// Start a new game when the server starts
initGame();

// Middleware to serve static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); // To parse JSON bodies

// Endpoint to get the game state
app.get('/api/game', (req, res) => {
  res.json({
    guessCount,
    guesses,
  });
});

// Endpoint to process a guess
app.post('/api/guess', (req, res) => {
let feedbackMessage;

// Won't let user guess if game is already over
 if (gameWon || giveUp) {
    feedbackMessage = 'Game is already over. Please reset the game to play again.';
    res.json({ feedbackMessage });
    return;
}

  const { guess } = req.body;

  const difference = Math.abs(targetNumber - guess);

  // Check if the guess is valid meaning it is a number between -1000 and 1000. If not, provide feedback to the user. Does not count as a guess.
  if (isNaN(guess) || guess < -1000 || guess > 1000) {
    feedbackMessage ='Please enter a valid number between -1000 and 1000.'
    res.json({ feedbackMessage, guessCount, guesses });
    return;
  }
  else if (guess === targetNumber) {
    feedbackMessage = `Correct! You guessed the number in ${guessCount} attempt(s). Press the play again button to start another game.`;
    gameWon = true;
  } else if (guess > targetNumber) {
    feedbackMessage = 'Number is less than your guess';
  } else if (guess < targetNumber) {
    feedbackMessage = 'Number is greater than your guess';
  }

  guessCount++;
  guesses.push(guess);

  res.json({
    feedbackMessage,
    guessCount,
    guesses,
    gameWon,
  });
});

// Endpoint to reset the game
app.post('/api/reset', (req, res) => {
  initGame();
  res.json({ message: 'Game has been reset.' });
});

// Endpoint to give up and reveal the number
app.post('/api/giveup', (req, res) => {
    if (giveUp || gameWon) {
      res.json({ feedbackMessage: 'Game is already over. Press the Play again or Reset Game button to play again.' });
      return;
    }
    let feedbackMessage = `The number was ${targetNumber}. Press the Reset Game button to play again.`;
    giveUp = true;
    res.json({ feedbackMessage });
    });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
