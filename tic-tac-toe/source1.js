
let board = ["", "", "", "", "", "", "", "", ""];

const boxes = document.querySelectorAll(".box");
let difficulty = "hard";
let winSound = new Audio("winsound.mp3");
let losseSound = new Audio("losssound.mp3");
let drawSound = new Audio("drawsound.mp3");

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function setDifficulty(level) {
    difficulty = level;
}


function checkWinner(board) {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes("")) return "draw";

    return null;
}

function minimax(board, isMaximizing) {
    let result = checkWinner(board);

    if (result !== null) {
        if (result === "O") return 1;
        if (result === "X") return -1;
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;

    } else {
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function bestMove() {
    let moves = [];

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";

            let score = minimax(board, false);

            board[i] = "";

            moves.push({ index: i, score: score });
        }
    }

    moves.sort((a, b) => b.score - a.score);
    let chosenMove;
    if (difficulty === "hard") {
        chosenMove = moves[0]; 
    } 
    else if (difficulty === "medium") {
        chosenMove = moves[Math.min(1, moves.length - 1)];
    } 
    else {
        chosenMove = moves[Math.min(2, moves.length - 1)];
    }

    board[chosenMove.index] = "O";
}

function handleClick(e) {
    let index = e.target.dataset.index;

    if (board[index] !== "") return;
    if (checkWinner(board) !== null) return;

    board[index] = "X";

    updateUI();

    if (checkWinner(board) === null) {
        setTimeout(() => {
            bestMove();
            updateUI();
            showResult();
        }, 400);
    } else {
        showResult();
    }
}

function updateUI() {
    boxes.forEach((box, index) => {
        box.innerText = board[index];
    });
}

function confettiEffect() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}
function showResult() {
    let result = checkWinner(board); 

    if (result === null) return;

    let popup = document.getElementById("result-popup");
    let text = document.getElementById("result-text");

    if (result === "X") {
        text.innerText = "You Win 👩";
        confettiEffect();
        winSound.play();
        
        
    } 
    else if (result === "O") {
        text.innerText = "AI Wins 🤖";
        losseSound.play();
        
    } 
    else {
        text.innerText = "Draw 🤝";
        drawSound.play();
    }

    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    updateUI();
}

boxes.forEach(box => {
    box.addEventListener("click", handleClick);
});

