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

const playerOneDefault = { name: "Player 1", marker: "X" };
const playerTwoDefault = { name: "Player 2", marker: "O" };
let game = null;

function startGame(p1, p2){
    const playerOne = createPlayer(p1 || playerOneDefault.name, 'X' || playerOneDefault.marker);
    const playerTwo = createPlayer(p2 || playerTwoDefault.name, 'O' || playerTwoDefault.marker);
    game = gameFlow(playerOne, playerTwo);
}

const displayController = (function(){
    const gameScreen = document.getElementById('game-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const playerTurnContainer = document.getElementById('player-turn-container');
    const boardContainer = document.getElementById('board-container');
    const buttonsContainer = document.getElementById('buttons-container');
    const currPlayerName = document.createElement('h2');
    const winningPlayer = document.createElement('h2');

    const enterGameButton = document.getElementById('enter-game-button');
    enterGameButton.addEventListener('click', handleEnterGameClick);

    const closeGameButton = document.getElementById('close-game-button');
    closeGameButton.addEventListener('click', showWelcomeScreen);

    function initGame(){
        renderGameboard();
        renderPlayerTurn();
        renderButtonsContainer();
    }

    function showGameScreen(){
        gameScreen.style.display = 'block';
        welcomeScreen.style.display = 'none';
    }

    function showWelcomeScreen(){
        welcomeScreen.style.display = 'block';
        gameScreen.style.display = 'none';
    }

    function gameOver(){
        renderWinnerDisplay();
        renderGameboard();
    }
    
    function renderGameboard(){
        boardContainer.textContent = '';
        const grid = document.createElement('div');
        grid.classList.add('grid');
        
        let board = Gameboard.getBoard();

        board.forEach((element, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.id = index;
            cell.textContent = element;
            cell.addEventListener('click', handleCellClick)
            grid.appendChild(cell);
        });
        boardContainer.appendChild(grid);
    }

    function renderPlayerTurn(){
        currPlayerName.textContent = `${game.getCurrPlayer().name}'s turn`; 
        playerTurnContainer.appendChild(currPlayerName);
    }

    function renderButtonsContainer(){
        const newGameButton = document.createElement('button');
        newGameButton.classList.add('newGameButton');
        newGameButton.textContent = 'New Game'

        newGameButton.addEventListener('click', handleNewGameClick);

        buttonsContainer.appendChild(newGameButton);
    }

    function renderWinnerDisplay(){
        currPlayerName.remove();

        if (game.getWinner() == 'tie'){
            winningPlayer.textContent = `It's a tie!`;
        } else {
            winningPlayer.textContent = `${game.getCurrPlayer().name} wins!`;
        }
        playerTurnContainer.appendChild(winningPlayer);
    }

    function handleCellClick(e){
        const index = e.target.dataset.id;

        game.handlePlayerMove(index);

        if (game.getWinner() != ''){
            gameOver();
        } else {
            renderGameboard();
            renderPlayerTurn();
        } 
    }

    function handleNewGameClick(){
        game.reset();
        winningPlayer.remove();
        renderGameboard();
        renderPlayerTurn();
    }

    function handleEnterGameClick(){
        playerOneName = document.getElementById('player-one-name').value;
        playerTwoName = document.getElementById('player-two-name').value;
        startGame(playerOneName, playerTwoName);
        initGame();
        showGameScreen();
    }

    return {
        initGame,
    };

})();

