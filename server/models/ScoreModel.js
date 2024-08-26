const mongoose = require('mongoose');
const RecordedScoresSchema = mongoose.Schema(
    {
        leastAttempts: {
            type: Number,
            required: [true, "Least amount of attempts is required"],
            default: 999
        },
        
        mostAttempts: {
            type: Number,
            required: [true, "Product quantity is required"],
            default: 0
        },
    },
    {
        timestamps: true
    }
);

const RecordedScores = mongoose.model('RecordedScores', RecordedScoresSchema);
module.exports = RecordedScores;