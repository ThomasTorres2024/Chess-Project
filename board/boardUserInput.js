import {convertApproximateCoordsToBoard} from "/board/boardutility.js"
import {BoardGraphicsManager} from "/board/graphics/boardfunctions.js";
import RoundManager from "/board/round/roundmanager.js"
import Coordinator from "/board/gamecoordinator.js";

//Moves squares according to user input, coordinates input with the code for how the board's rules 
export function getUserBoardInput(coordinator)
{
    const board = document.getElementById("chess_board_container");

    //Click events, encompasses moving pieces for now
    board.addEventListener("click", event => {

        //if a piece has already been visualized then devisualize it. 

        //get dimensions of chess board container div, changes based upon user zoomer cna't hardcode values here 
        const rect = board.getBoundingClientRect();
        let bottom = rect.bottom;
        let left = rect.left;

        //get  pos of click
        const x = event.clientX-left;
        const y = bottom-event.clientY;

        //get piece's coord and square 
        const pieceCoord = convertApproximateCoordsToBoard(x,y);

        //send user input to input handler
        coordinator.processSquareMoveinput(pieceCoord);})
}


