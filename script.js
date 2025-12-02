const { getDefaultSettings } = require("http2");

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
        if(!currPlayer.placeMarker(index) || !gameOver){
            switchTurn();
        }

        if(Gameboard.checkWinConditions(currPlayer.marker)){
            console.log('game over!')
            winner = currPlayer;
            gameOver = true;
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

function displayController(){

}


