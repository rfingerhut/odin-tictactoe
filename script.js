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

    return {
        getBoard,
        placeMarker,
        checkWinConditions,
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
            }
            switchTurn();
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

const playerOne = createPlayer("Player 1", "X");
const playerTwo = createPlayer("Player 2", "O");
const game = gameFlow(playerOne, playerTwo);

const displayController = (function(){
    const playerTurnContainer = document.getElementById('player-turn-container');
    const boardContainer = document.getElementById('board-container');
    const buttonsContainer = document.getElementById('buttons-container');
    const currPlayerName = document.createElement('h2');
    const currPlayerMark =  document.createElement('h2');


    function init(){
        renderGameboard();
        renderButtonsContainer();
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

        currPlayerName.textContent = game.getCurrPlayer().name; 
        currPlayerMark.textContent = game.getCurrPlayer().marker;
        playerTurnContainer.append(currPlayerName, currPlayerMark);
    }

    function renderButtonsContainer(){
        const newGameButton = document.createElement('button');
        newGameButton.classList.add('newGameButton');
        newGameButton.textContent = 'New Game'

        newGameButton.addEventListener('click', handleNewGameClick);

        buttonsContainer.appendChild(newGameButton);
    }

    function handleCellClick(e){
        const index = e.target.dataset.id;

        game.handlePlayerMove(index);

        renderGameboard();
    }

    function handleNewGameClick(){
        game.reset();
        renderGameboard();
    }

    return {
        init,
    };

})();

displayController.init();
