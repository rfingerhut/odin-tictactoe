const Gameboard = (function () {
    const board = ['', '', '', '', '', '', '', '', ''];
    
    function getBoard(){
        return board.slice();
    };

    function clearBoard(){
        board.fill('');
    }

    function placeMarker(index, marker){
        if (!checkEmptyCell(index)){
            return false;
        } else {
            board[index] = marker;
            return true;
        }
    }

    function checkEmptyCell(index){
        return (board[index] === '');
    }

    function checkWinConditions(marker){
        const markedIndexes=[];

        for (let i = 0; i < 9; i++) {
            if(board[i] === marker){
                markedIndexes.push(i);
            }
        }

        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        
        const winnerExists = winPatterns.some(pattern => pattern.every(el => markedIndexes.includes(el)));

        return(winnerExists);
    }

    function checkTieConditions(){
        return (board.every(cell => cell != ''));
    }

    return {
        getBoard,
        placeMarker,
        checkWinConditions,
        checkTieConditions,
        clearBoard,
    }
})();


function createPlayer(name, marker){
    let score = 0;

    function placeMarker(index){
        return(Gameboard.placeMarker(index, marker));
    }

    function updateScore(){
        score++;
    }

    function getScore(){
        return score;
    }

    function resetScore(){
        score = 0;
    }

    return {
        name, 
        marker, 
        updateScore,
        getScore,
        resetScore,
        placeMarker,
    }
};

function gameFlow(playerOne, playerTwo){
    let currPlayer = playerOne;
    let winner = '';
    let gameOver = false;

    function switchTurn(){
        (currPlayer === playerOne) ? currPlayer = playerTwo : currPlayer = playerOne;
    }

    function handlePlayerMove(index){
        if (gameOver) {
            return;
        }

        if(currPlayer.placeMarker(index)){
            if(Gameboard.checkWinConditions(currPlayer.marker)){
                winner = currPlayer;
                currPlayer.updateScore();
                gameOver = true;
            } else if (Gameboard.checkTieConditions()){
                winner = 'tie';
            } else {
                switchTurn();
            }
        } 
    }

    function getWinner(){
        return winner;
    }

    function getCurrPlayer(){
        return currPlayer;
    }

    function reset(){
        Gameboard.clearBoard();
        winner = '';
        gameOver = false;
    }

    function resetScores(){
        playerOne.resetScore();
        playerTwo.resetScore();
    }

    return{
        handlePlayerMove,
        getCurrPlayer,
        getWinner,
        reset,
        resetScores,
        playerOne,
        playerTwo,
    }
}

const gameController = (function(){
    const playerOneDefault = { name: "Player 1", marker: "X" };
    const playerTwoDefault = { name: "Player 2", marker: "O" };
    let game = null;

    function startGame(p1Name, p2Name){
        const playerOne = createPlayer(p1Name || playerOneDefault.name, playerOneDefault.marker);
        const playerTwo = createPlayer(p2Name || playerTwoDefault.name, playerTwoDefault.marker);
        game = gameFlow(playerOne, playerTwo);
    }

    function getGame(){
        return game;
    }

    return{
        startGame,
        getGame,
        
    }
})();



const displayController = (function(){
    const gameScreen = document.getElementById('game-screen');
    const welcomeScreen = document.getElementById('welcome-screen');

    const boardContainer = document.getElementById('board-container');
    const buttonsContainer = document.getElementById('buttons-container');

    const enterGameButton = document.getElementById('enter-game-button');
    enterGameButton.addEventListener('click', handleEnterGameClick);

    function initGame(){
        buildBoardUI();
        renderGameboard();
        renderPlayerTurn();
        initPlayerScores();
        renderScores();
        initButtons();
    }

    function renderScores(){
        const playerOne = document.getElementById('player-one');
        playerOne.textContent = gameController.getGame().playerOne.getScore();
        
        const playerTwo = document.getElementById('player-two');
        playerTwo.textContent = gameController.getGame().playerTwo.getScore();
    }

    function initPlayerScores(){
        const playerOneName = document.getElementById('player-one-score-name');
        playerOneName.textContent = `${gameController.getGame().playerOne.name}`;

        const playerTwoName = document.getElementById('player-two-score-name');
        playerTwoName.textContent = `${gameController.getGame().playerTwo.name}`;
    }

    function buildBoardUI(){
        boardContainer.textContent = '';
        const grid = document.createElement('div');
        grid.classList.add('grid');

        for (let index = 0; index < 9; index++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.id = index;
            cell.addEventListener('click', handleCellClick)
            grid.appendChild(cell);
        }

        boardContainer.appendChild(grid);
    }

    function showGameScreen(){
        gameScreen.style.display = 'grid';
        welcomeScreen.style.display = 'none';
    }

    function showWelcomeScreen(){
        welcomeScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
    }
    

    function renderGameboard(){
        const board = Gameboard.getBoard();
        const cells = boardContainer.querySelectorAll('.cell');

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        })
    }

    function initButtons(){
        if (buttonsContainer.querySelector('.game-button')) return;

        const newGameButton = document.createElement('button');
        const closeGameButton = document.createElement('button');

        newGameButton.classList.add('button', 'game-button');
        closeGameButton.classList.add('game-button');
        closeGameButton.id = 'close-game-button';

        newGameButton.textContent = 'New Game';
        closeGameButton.textContent = 'X Close';

        newGameButton.addEventListener('click', handleNewGameClick);
        closeGameButton.addEventListener('click', handleCloseGameClick);

        buttonsContainer.appendChild(newGameButton);
        gameScreen.prepend(closeGameButton);
    }

    function renderPlayerTurn(){
        const turnText = document.getElementById('player-turn');

        if(!gameController.getGame().getWinner()){
            turnText.textContent =`${gameController.getGame().getCurrPlayer().name}'s turn`; 
        } else if (gameController.getGame().getWinner() === 'tie'){
            turnText.textContent = `It's a tie!`;
        } else {
            turnText.textContent = `${gameController.getGame().getCurrPlayer().name} wins!`;
            renderScores();
        }
    }

    function handleCellClick(e){
        const index = e.target.dataset.id;

        gameController.getGame().handlePlayerMove(index);

        renderGameboard();
        renderPlayerTurn();
    }

    function handleNewGameClick(){
        gameController.getGame().reset();

        renderGameboard();
        renderPlayerTurn();
    }

    function handleEnterGameClick(){
        let playerOneName = document.getElementById('player-one-name').value;
        const playerTwoName = document.getElementById('player-two-name').value;

        gameController.startGame(playerOneName, playerTwoName);
        initGame();
        showGameScreen();
    }

    function handleCloseGameClick(){
        gameController.getGame().reset();
        gameController.getGame().resetScores();
        showWelcomeScreen();
    }
})();

