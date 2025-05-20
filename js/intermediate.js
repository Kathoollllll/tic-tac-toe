document.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const displayPlayer = document.querySelector('.display-player');
    const announcer = document.querySelector('.announcer');
    const resetButton = document.getElementById('reset');
    const playAgainButton = document.getElementById('play-again');
    const quitGameButton = document.getElementById('quit-game');
    const backToMenuButton = document.getElementById('back-to-menu');
    const winModal = document.getElementById('win-modal');
    const winMessage = document.getElementById("win-message");
    const overlay = document.getElementById('overlay');
    const usernameModal = document.getElementById('username-modal');
    const welcomeModal = document.getElementById('welcome-modal');
    const nextButton = document.getElementById('next-button');
    const startGameButton = document.getElementById('start-game');
    const playerXInput = document.getElementById('player-x-name');
    const playerOInput = document.getElementById('player-o-name');
    const welcomeMessage = document.getElementById('welcome-message');
    const backToMenuModal = document.getElementById('back-to-menu-modal');
    const resumeGameButton = document.getElementById('resume-game');
    const renamePlayersButton = document.getElementById('rename-players');
    const confirmBackToMenuButton = document.getElementById('confirm-back-to-menu');
    const playerXLabel = document.querySelectorAll('.score-label')[0];
    const playerOLabel = document.querySelectorAll('.score-label')[1];
    const displaySection = document.querySelector('.display');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');

    let playerXName = "Player X";
    let playerOName = "Player O"; 

    let board = Array(16).fill("");
    let currentPlayer = "X";
    let isGameActive = true; 
    let winsX = 0;
    let winsO = 0;

    function showFinalWinner(winner) {
        winMessage.textContent = `🏆 ${winner} wins the match!`;
        winModal.classList.add("show");
        overlay.classList.add("show");
    }

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        // Horizontal
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        // Vertical
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        // Diagonal
        [0, 5, 10, 15],
        [3, 6, 9, 12]
    ];

    const clickSound = new Audio('../../sounds/click.wav');
    const winSound = new Audio('../../sounds/win.mp3');
    const tieSound = new Audio('../../sounds/tie.wav');

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c, d] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[b] === board[c] && board[c] === board[d]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (!board.includes("")) {
            announce(TIE);
        }
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                scoreO.innerText = parseInt(scoreO.innerText) + 1;
                winsO++;
                winSound.play();
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                scoreX.innerText = parseInt(scoreX.innerText) + 1;
                winsX++;
                winSound.play();
                break;
            case TIE:
                announcer.innerText = 'Tie!';
                tieSound.play();
                break;
        }
    
        announcer.classList.remove('hide');
        showModal(announcer.innerHTML);
    
        if (winsX === 3 || winsO === 3) {
            const winner = winsX === 3 ? 'Player X' : 'Player O';
            showFinalWinner(winner);
        }
    };    

    const showModal = (message) => {
        document.getElementById('win-message').innerHTML = message;
        winModal.classList.add('show');
        overlay.classList.add('show');
    };

    const hideModal = () => {
        winModal.classList.remove('show');
        overlay.classList.remove('show');
    };

    const isValidAction = (tile) => tile.innerText === "";

    const updateBoard = (index) => board[index] = currentPlayer;

    const changePlayer = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        const currentName = currentPlayer === "X" ? playerXName : playerOName;
    
        displaySection.innerHTML = `<span class="display-player player${currentPlayer}">${currentName}</span>'s turn`;
    };

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            clickSound.play();
            updateBoard(index);
            handleResultValidation();
            if (isGameActive) changePlayer();
        }
    };

    const resetBoard = () => {
        board = Array(16).fill("");
        isGameActive = true;
        announcer.classList.add('hide');

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX', 'playerO');
        });

        if (currentPlayer === "O") changePlayer();
    };

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', () => {
        hideModal();
        resetBoard();
    });

    playAgainButton.addEventListener('click', () => {
        hideModal();
        resetBoard();
    });

    quitGameButton.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

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