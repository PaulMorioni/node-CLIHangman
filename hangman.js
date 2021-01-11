const fs = require('fs')
const csv = require('csv-parser')
const readline = require("readline");

function selectWord(results) {
    let word = results[Math.floor(Math.random() * results.length)];
    return word.word.toLowerCase()
};

function maskWord(selectedWord){
    maskedString = []
    for (i = 0; i < selectedWord.length; i++) {
    maskedString.push("_")
    }       
    return maskedString
};

function indicies(beingSearched, search){
    //Checks for multiple of the same letter
    let indices = [];
    for(let i=0; i<beingSearched.length;i++) {
        if (beingSearched[i] === search) indices.push(i);
    }
    return indices
};

function correctAnswer(answer, maskedArray, selectedWord){
    indexArray = indicies(selectedWord, answer)
    for(let i in indexArray){
        maskedArray[indexArray[i]] = answer
    };
    console.log(maskedArray.join(' '))
    return maskedArray
}

function openInterface(selectedWord, maskedArray) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let incorrectCounter = 0
    let guesses = []

    function recursiveAsyncReadLine() {
        rl.question('What is your guess?: ', function (answer) {
            if (answer.length == 1){
            let guessed = false
            if (guesses.indexOf(answer) == -1){ //Stops accumulation of multiple same guesses
                guesses.push(answer)
            } else {
                guessed = true
            }
            
            if (incorrectCounter > 5){ //Fail Case
                console.log(`\nSorry, You lost. The word was ${selectedWord}`)
                return rl.close(); 
                }

            if(selectedWord.search(answer) != -1 ){
            console.log(`${answer} is correct\n`)
            maskedArray = correctAnswer(answer, maskedArray, selectedWord)
            } else {
                if(!guessed){
                    incorrectCounter++
                }
                console.log(`Guesses Left: ${7-incorrectCounter}`);
                console.log(maskedArray.join(' '));
            }
            console.log(`\nGuesses: ${guesses}\n`)
            if(maskedArray.indexOf("_") == -1) { //Checks if all "_" have been removed for win
                console.log("Congrats!")
                return rl.close()
            }
            console.log("\n_______________________________________\n")
          recursiveAsyncReadLine();
        } else {
            console.log("One letter at a time please")
            recursiveAsyncReadLine();
        }
        });
      };

      recursiveAsyncReadLine();     
    rl.on("close", function() {
        console.log("\nGood Game!");
        process.exit(0);
    });
}

function runApp() {
    const results = []
    fs.createReadStream('wordlist.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        const selectedWord = selectWord(results);
        maskedArray = maskWord(selectedWord)
        console.log(maskedArray.join(' '));
        openInterface(selectedWord, maskedArray);
    });
};

runApp();