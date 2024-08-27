# NumberGuessingGame
This is an evil number guessing CRUD game I made. The app generates a random number between -1000000 and 1000000 (to make this game really hard) and the user has to guess it in the least amount of tries. The user can also store their highest and lowest attempts and reset them at any time. I hope you enjoy this game! It took me five days to make it. I don't think I will have this much free time again haha.

# Development Process
I used HTML, CSS, and JavaScript for parsing in the values (as a request body) that the user would put as a guess in the input box for the backend and to deliver values brought from the backend to the end user. I utilized NodeJS to process the user's guess from the request body sent from the frontend code and to decide the logic for handling such values. I also utilized MongoDB for storing one record of data (to prevent database bloat) relating to the least/most amount of attempts the user would take to correctly guess the random number. The reset button was added later to let the user reset their most/least attempts to get the correct answer and I did this for any user who wants to play this game as they can just reset the scores from the last person that played it. ALso, if this game's MongoDB Cluster is deleted for some reason, this game won't work anymore. 

# Commands to use after cloning this repository:
npm install express
npm install mongodb
npm install mongoose
npm install dotenv
node server/app.js

# Credits
Visuals - Kartikeya Kumaria
Functionality - Kartikeya Kumaria
MongoDB database setup - Kartikeya Kumaria
NodeJS setup - Kartikeya Kumaria
.gitignore - Kartikeya Kumaria
Mongoose Database schema for the scores record - Kartikeya Kumaria
Front-End Code - Kartikeya Kumaria
Back-End Code - Kartikeya Kumaria
README.md - Kartikeya Kumaria
