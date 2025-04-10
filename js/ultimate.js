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

    const changePlayer = () => {
        displayPlayer.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        displayPlayer.innerText = currentPlayer;
        displayPlayer.classList.add(`player${currentPlayer}`);
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

    backToMenuButton?.addEventListener('click', () => {
        window.location.href = '../../difficulty.html';
    });

    quitGameButton?.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });
});