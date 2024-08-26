// /server/app.js
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const RecordedScores = require('./models/ScoreModel.js');

// Game logic variables
let targetNumber;
let guessCount;
let guesses;
let gameWon = false;
let giveUp = false;

// Initialize a new game
function initGame() {
  giveUp = false;
  gameWon = false;
  targetNumber = Math.floor(Math.random() * 2000001) - 1000000;
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
app.get('/api/game', async (req, res) => {
  try {
    // Fetch the current record of least and most attempts
    let scoreRecord = await RecordedScores.findOne();
    let leastAttempts = "No record yet";
    let mostAttempts = "No record yet";

    if (scoreRecord) {
      leastAttempts = scoreRecord.leastAttempts === 999 ? "No record yet" : scoreRecord.leastAttempts;
      mostAttempts = scoreRecord.mostAttempts === 0 ? "No record yet" : scoreRecord.mostAttempts;
    }

    res.json({
      guessCount,
      guesses,
      leastAttempts,
      mostAttempts,
    });
  } catch (err) {
    console.error("Error fetching game state:", err);
    res.status(500).json({ message: "An error occurred while fetching the game state." });
  }
});

// Endpoint to process a guess
app.post('/api/guess', async (req, res) => {
  let feedbackMessage;
  let soundID = "guessinvalid";

  // Won't let user guess if the game is already over
  if (gameWon || giveUp) {
    feedbackMessage = 'Game is already over. Please reset the game to play again.';
    res.json({ feedbackMessage, soundID });
    return;
  }

  const { guess } = req.body;

  // Validate the guess
  if (guess == null || guess < -1000000 || guess > 1000000) {
    feedbackMessage = 'Please enter a valid number between -1000000 and 1000000.';
    res.json({ feedbackMessage, guessCount, guesses, soundID });
    return;
  }

  try {
    // Fetch or create the score record
    let scoreRecord = await RecordedScores.findOne();
    if (!scoreRecord) {
      scoreRecord = new RecordedScores(); // Initializes with default values
    }

    // Process the guess
    if (guess === targetNumber) {
      feedbackMessage = `Correct! You guessed the number in ${guessCount} attempt(s). Press the play again button to start another game.`;
      gameWon = true;
      soundID = "guessexact";  

      // Update the score record if the new score is better
      if (guessCount < scoreRecord.leastAttempts) {
        scoreRecord.leastAttempts = guessCount;
      }
      if (guessCount > scoreRecord.mostAttempts) {
        scoreRecord.mostAttempts = guessCount;
      }

      await scoreRecord.save(); // Save the record to the database
      console.log("Score record updated:", scoreRecord);
    } 
    else if (guess > targetNumber) {
      feedbackMessage = 'Number is less than your guess';
      soundID = "guessover";
    } 
    else if (guess < targetNumber) {
      feedbackMessage = 'Number is greater than your guess';
      soundID = "guessunder";
    }

    // Prepare least and most attempts for the response
    let leastAttempts = scoreRecord.leastAttempts;
    let mostAttempts = scoreRecord.mostAttempts;

    if (leastAttempts === 999) {
      leastAttempts = "No record yet";
    }
    if (mostAttempts === 0) {
      mostAttempts = "No record yet";
    }

    guessCount++;
    guesses.push(guess);

    res.json({
      feedbackMessage,
      guessCount,
      guesses,
      gameWon,
      leastAttempts,
      mostAttempts,
      soundID,
    });

  } catch (err) {
    console.error("Error processing guess or updating score record:", err);
    res.status(500).json({ feedbackMessage: "An error occurred. Please try again later." });
  }
});

// Endpoint to reset the game
app.post('/api/reset', (req, res) => {
  initGame();
  res.json({ message: 'Game has been reset.', gameWon });
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


// Endpoint to reset the least and most attempts
app.post('/api/reset-attempts', async (req, res) => {
  soundID = "deleterecord";
  try {
    let scoreRecord = await RecordedScores.findOne();

    if (!scoreRecord) {
      // If no record exists, create a new one
      scoreRecord = new RecordedScores();
    } else {
      // Reset the values to their defaults
      if (scoreRecord.leastAttempts === 999 && scoreRecord.mostAttempts === 0) {
        soundID = "recordalreadydeleted";
      }
      scoreRecord.leastAttempts = 999;
      scoreRecord.mostAttempts = 0;
    }

    await scoreRecord.save();
    res.json({ message: 'Attempts records have been reset.', soundID });
  } catch (err) {
    console.error("Error resetting attempts records:", err);
    res.status(500).json({ message: 'An error occurred while resetting attempts records.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to the database
let connection_string = "mongodb+srv://kartikeyaku:tbLc6ziCnrzpUdSZ@cluster0.vada2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(connection_string)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Cannot connect to the database:", err);
  });
