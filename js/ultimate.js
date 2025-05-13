document.addEventListener('DOMContentLoaded', () => {
    const boards = Array.from(document.querySelectorAll('.board'));
    const displayPlayer = document.querySelector('.display-player');
    const announcer = document.querySelector('.announcer');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const resetButton = document.getElementById('reset');
    const playAgainButton = document.getElementById('play-again');
    const quitGameButton = document.getElementById('quit-game');
    const backToMenuButton = document.getElementById('back-to-menu');
    const winModal = document.getElementById('win-modal');
    const winMessage = document.getElementById("win-message");
    const overlay = document.getElementById('overlay');

    // new codes
    const usernameModal = document.getElementById('username-modal');
    const welcomeModal = document.getElementById('welcome-modal');
    const nextButton = document.getElementById('next-button');
    const startGameButton = document.getElementById('start-game');
    const playerXInput = document.getElementById('player-x-name');
    const playerOInput = document.getElementById('player-o-name');
    const welcomeMessage = document.getElementById('welcome-message');

    //new codes
    const backToMenuModal = document.getElementById('back-to-menu-modal');
    const resumeGameButton = document.getElementById('resume-game');
    const renamePlayersButton = document.getElementById('rename-players');
    const confirmBackToMenuButton = document.getElementById('confirm-back-to-menu');

    //new codes
    const playerXLabel = document.querySelectorAll('.score-label')[0];
    const playerOLabel = document.querySelectorAll('.score-label')[1];
    const displaySection = document.querySelector('.display');

    //new
    let playerXName = "Player X";
    let playerOName = "Player O"; 

    let currentPlayer = "X";
    let isGameActive = true;
    let boardStates = Array(9).fill(null).map(() => Array(9).fill(""));
    let boardWinners = Array(9).fill(""); 
    let activeBoard = null;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const clickSound = new Audio('../../sounds/click.wav');
    const winSound = new Audio('../../sounds/win.mp3');
    const tieSound = new Audio('../../sounds/tie.wav');

    const showFinalWinner = (winner) => {
        winMessage.textContent = `🏆 ${winner} wins the match!`;
        winModal.classList.add("show");
        overlay.classList.add("show");
    };

    const handleResultValidation = (boardIndex) => {
        const board = boardStates[boardIndex];
        let roundWon = false;

        for (let [a, b, c] of winningConditions) {
            if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            boardWinners[boardIndex] = currentPlayer;
            checkUltimateWin();
        } else if (!board.includes("")) {
            boardWinners[boardIndex] = "T";
        }
    };

    const checkUltimateWin = () => {
        for (let [a, b, c] of winningConditions) {
            if (
                boardWinners[a] !== "" &&
                boardWinners[a] !== "T" &&
                boardWinners[a] === boardWinners[b] &&
                boardWinners[b] === boardWinners[c]
            ) {
                showFinalWinner(currentPlayer);
                isGameActive = false;
                currentPlayer === "X"
                    ? scoreX.innerText = parseInt(scoreX.innerText) + 1
                    : scoreO.innerText = parseInt(scoreO.innerText) + 1;
                return;
            }
        }

        if (boardWinners.every(status => status !== "")) {
            showFinalWinner("Nobody"); 
            isGameActive = false;
        }
    };

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                scoreO.innerText = parseInt(scoreO.innerText) + 1;
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                scoreX.innerText = parseInt(scoreX.innerText) + 1;
                break;
            case TIE:
                announcer.innerText = 'Tie!';
                break;
        }
        announcer.classList.remove('hide');
        showModal(announcer.innerHTML);
    };

    const showModal = (message) => {
        winMessage.innerHTML = message;
        winModal.classList.add('show');
        overlay.classList.add('show');
    };

    const hideModal = () => {
        winModal.classList.remove('show');
        overlay.classList.remove('show');
    };

    const isValidAction = (tile) => tile.innerText === "";

    const updateBoardState = (boardIndex, tileIndex) => {
        boardStates[boardIndex][tileIndex] = currentPlayer;
    };

     // new codes
     const changePlayer = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        const currentName = currentPlayer === "X" ? playerXName : playerOName;
    
        displaySection.innerHTML = `<span class="display-player player${currentPlayer}">${currentName}</span>'s turn`;
    };

    const userAction = (boardIndex, tile, tileIndex) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoardState(boardIndex, tileIndex);
            handleResultValidation(boardIndex);
            if (isGameActive) {
                activeBoard = tileIndex;
                if (boardWinners[activeBoard] !== "" || boardStates[activeBoard].every(cell => cell !== "")) {
                    activeBoard = null; 
                }
                changePlayer();
            }
        }
    };

    const resetGame = () => {
        boardStates = Array(9).fill(null).map(() => Array(9).fill(""));
        boardWinners = Array(9).fill("");
        isGameActive = true;
        announcer.classList.add('hide');

        boards.forEach((board) => {
            const tiles = Array.from(board.querySelectorAll('.tile'));
            tiles.forEach(tile => {
                tile.innerText = '';
                tile.classList.remove('playerX', 'playerO');
            });
        });

        activeBoard = null;
        if (currentPlayer === "O") changePlayer();
    };

    const resetBoard = () => resetGame();

    boards.forEach((board, boardIndex) => {
        const tiles = Array.from(board.querySelectorAll('.tile'));
        tiles.forEach((tile, tileIndex) => {
            tile.addEventListener('click', () => {
                if (!isGameActive) return;
                if (activeBoard === null || activeBoard === boardIndex || boardStates[activeBoard].every(cell => cell !== "")) {
                    userAction(boardIndex, tile, tileIndex);
                }
            });
        });
    });

    resetButton?.addEventListener('click', () => {
        hideModal();
        resetGame();
    });

    playAgainButton?.addEventListener('click', () => {
        hideModal();
        resetBoard();
    });

    // backToMenuButton?.addEventListener('click', () => {
    //     window.location.href = '../../difficulty.html';
    // });

    quitGameButton?.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    //new codes
    nextButton.addEventListener('click', () => {
        playerXName = playerXInput.value.trim() || "Player X";
        playerOName = playerOInput.value.trim() || "Player O";

    playerXLabel.textContent = playerXName;
    playerOLabel.textContent = playerOName;

    welcomeMessage.textContent = `Welcome ${playerXName} and ${playerOName}! Enjoy the game.`;

    usernameModal.classList.remove('show');
    welcomeModal.classList.add('show');
    });
    
    startGameButton.addEventListener('click', () => {
        welcomeModal.classList.remove('show');
        overlay.classList.remove('show');

        const current = currentPlayer === "X" ? playerXInput.value.trim() || "Player X" : playerOInput.value.trim() || "Player O";
        const currentName = currentPlayer === "X" ? playerXName : playerOName;
        displaySection.innerHTML = `<span class="display-player player${currentPlayer}">${currentName}</span>'s turn`;
    });

    backToMenuButton.addEventListener('click', () => {
        backToMenuModal.classList.add('show');
        overlay.classList.add('show');
    });

    resumeGameButton.addEventListener('click', () => {
        backToMenuModal.classList.remove('show');
        overlay.classList.remove('show');
    });

    renamePlayersButton.addEventListener('click', () => {
        backToMenuModal.classList.remove('show');
        overlay.classList.remove('show');
        usernameModal.classList.add('show');
    });

    confirmBackToMenuButton.addEventListener('click', () => {
        window.location.href = '../../difficulty.html';
    });
});