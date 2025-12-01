// PLANNING

// store gameboard as an array inside of a Gameboard object.
const Gameboard = (function () {
    const board = ['', '', '', '', '', '', '', '', ''];
    let totalMoves = 0;
    
    function getBoard(){
        return board
    };

    function placeMarker(index, marker){
        if (board[index] != ''){
            return;
        }

        board[index] = marker;
        totalMoves++;

        if(totalMoves >= 5){
            console.log(checkWinConditions(marker));
        };
    }

    function getTotalMoves(){
        return totalMoves;
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
        
        // check to see if winPatterns includes markedIndexes
        const winnerExists = winPatterns.some(pattern => pattern.every(el => markedIndexes.includes(el)));

        return(winnerExists);
    }

    return {
        getBoard,
        placeMarker,
        getTotalMoves,
    }
})();

// store players in objects
function createPlayer(name, marker){
    function placeMarker(index){
        Gameboard.placeMarker(index, marker);
    }

    return {
        name, 
        marker, 
        placeMarker,
    }
};

function handlePlayerMove(player, index){
    // check validity of index?
    player.placeMarker(index);
}

// use object to control the flow of the game
function gameFlow(){
    // creates players
    const playerOne = createPlayer('Rachel', 'X');
    const playerTwo = createPlayer('Kyle', 'O');

    // Players place markers
    handlePlayerMove(playerOne, 0);
    handlePlayerMove(playerTwo,3);
    handlePlayerMove(playerOne, 3);
    handlePlayerMove(playerOne, 1);
    handlePlayerMove(playerTwo, 4);
    handlePlayerMove(playerOne, 2);    
}

function displayController(){

}

gameFlow();