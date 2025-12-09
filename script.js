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
    function placeMarker(index){
        return(Gameboard.placeMarker(index, marker));
    }

    return {
        name, 
        marker, 
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
        currPlayer = playerOne;
        gameOver = false;
    }

    return{
        handlePlayerMove,
        getCurrPlayer,
        getWinner,
        reset,
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
    const playerTurnContainer = document.getElementById('player-turn-container');
    const boardContainer = document.getElementById('board-container');
    const buttonsContainer = document.getElementById('buttons-container');

    const enterGameButton = document.getElementById('enter-game-button');
    enterGameButton.addEventListener('click', handleEnterGameClick);

    const closeGameButton = document.getElementById('close-game-button');
    closeGameButton.addEventListener('click', handleCloseGameClick);

    function initGame(){
        buildBoardUI();
        renderGameboard();
        renderPlayerTurn();
        renderButtonsContainer();
    }

    function showGameScreen(){
        gameScreen.style.display = 'grid';
        welcomeScreen.style.display = 'none';
    }

    function showWelcomeScreen(){
        welcomeScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
    }

    function gameOver(){
        renderWinnerDisplay();
        renderGameboard();
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

    function renderGameboard(){
        const board = Gameboard.getBoard();
        const cells = boardContainer.querySelectorAll('.cell');

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        })
    }

    // CREATES ELEMENT
    function renderButtonsContainer(){
        const newGameButton = document.createElement('button');
        newGameButton.classList.add('button');
        newGameButton.textContent = 'New Game';

        newGameButton.addEventListener('click', handleNewGameClick);

        buttonsContainer.appendChild(newGameButton);

    }

    function renderPlayerTurn(){
        // playerTurnContainer.textContent = '';
        // const turnText = document.createElement('h2');
        const turnText = document.getElementById('player-turn');
        turnText.textContent =`${gameController.getGame().getCurrPlayer().name}'s turn`; 
    }

    function renderWinnerDisplay(){
        playerTurnContainer.textContent = '';
        const winnerText = document.createElement('h2');

        if (gameController.getGame().getWinner() == 'tie'){
            winnerText.textContent = `It's a tie!`;
        } else {
            winnerText.textContent = `${gameController.getGame().getCurrPlayer().name} wins!`;
        }
        playerTurnContainer.appendChild(winnerText);
    }

    function handleCellClick(e){
        const index = e.target.dataset.id;

        gameController.getGame().handlePlayerMove(index);

        if (gameController.getGame().getWinner() != ''){
            gameOver();
        } else {
            renderGameboard();
            renderPlayerTurn();
        } 
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
        showWelcomeScreen();
        const gameScreen = document.getElementById('game-screen');
        gameScreen.querySelectorAll('.keep').forEach(el => el.innerHTML = '');
    }

    return {
        initGame,
    };

})();

