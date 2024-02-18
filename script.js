const hintsDiv = document.getElementById('hint-list');
const answerDiv = document.getElementById('answer');
const feedbackDiv = document.getElementById('feedback');
let fruitsUsed = [];
let hintIndex = 1;
let currentFruit = null;

function getFruit() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const remainingFruits = fruits.filter(fruit => !fruitsUsed.includes(fruit))
            if (remainingFruits.length === 0) {
                reject('Game Over. Thanks for playing!');
                document.getElementById('revealBtn').disabled = true;
            } else {
                const i = Math.floor(Math.random() * remainingFruits.length);
                const fruit = remainingFruits[i]
                fruitsUsed.push(fruit);
                currentFruit = fruit;
                resolve(fruit);
            }
        }, 200);
    });
}

document.getElementById('nextFruit').disabled = true;

// Start game
document.getElementById('startBtn').addEventListener('click', () => {
    getFruit().then((fruit) => {
        currentFruit = fruit;
        revealHint(currentFruit.hints[0]);
    })
    .catch((error) => {
        feedbackDiv.textContent = error;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('revealBtn').disabled = true;
    });

    document.getElementById('startBtn').disabled = true;
    document.getElementById('revealBtn').disabled = false;
    document.getElementById('nextFruit').disabled = false;
})


// Reveal hints
document.getElementById('revealBtn').addEventListener('click', () => {
    if (hintIndex < currentFruit.hints.length) {
        revealHint(currentFruit.hints[hintIndex])
        hintIndex++;
    }

    if (hintIndex === currentFruit.hints.length) {
        checkEndGame();
    }
});

function revealHint(hint) {
    const hintItem = document.createElement('li');
    hintItem.textContent = hint;
    hintsDiv.appendChild(hintItem);
}


// User types answer
document.getElementById('answerBtn').addEventListener('click', () => {
    userAnswer = answerDiv.value.toLowerCase();
    let feedbackMessage;
    if (userAnswer === currentFruit.word) {
        feedbackMessage = `You are right! The fruit is ${currentFruit.word}!`
        answerDiv.value = ''

        while(hintsDiv.firstChild) {
            hintsDiv.removeChild(hintsDiv.firstChild)
        }

        hintIndex = 1;

        document.getElementById("revealBtn").disabled = true;

    } else {
        feedbackMessage = 'Wrong. Try again.'
        answerDiv.value = '';
    }
    feedbackDiv.textContent = feedbackMessage;
    checkEndGame();
})


// Next fruit
document.getElementById('nextFruit').addEventListener('click', () => {
    getFruit().then((fruit) => {
        currentFruit = fruit;
        hintIndex = 1; 
        while (hintsDiv.firstChild) {
            hintsDiv.removeChild(hintsDiv.firstChild);
        }
        revealHint(currentFruit.hints[0]); 
        feedbackDiv.textContent = '';
        document.getElementById("revealBtn").disabled = false;
    }).catch((error) => {
        feedbackDiv.textContent = error;
        document.getElementById("nextFruit").disabled = true;
    });
    
});


// End game 
function checkEndGame() {
    if (fruitsUsed.length === fruits.length) {
        document.getElementById('startBtn').disabled = true;
        document.getElementById('revealBtn').disabled = true;
    }
}