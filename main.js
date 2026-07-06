import ChessBoard from "/board/chessboard.js"
import BoardSquare from "/board/boardsquare.js"
import { BoardGraphicsManager } from "./board/graphics/boardfunctions.js";
import Rook from "/board/chess_pieces/rook.js"
import { getUserBoardInput } from "./board/boardUserInput.js";
import { pointToColor } from "./board/boardutility.js";
import RoundManager from "/board/round/roundmanager.js"
import Coordinator from "/board/gamecoordinator.js";
import RoundDisplay from "/round_display/round_display_graphics.js";


function main() {
        let cherryDark = "";
        //let cherryDark = [228, 150, 192];
        let cherryLight = [255, 255, 255];
        let cherryHighlightLight = [149, 117, 209];
        let cherryHighlightDark = [212, 40, 200];

        let normalDark = [209, 139, 71];
        let normalLight = [255, 206, 158];
        let normalHighLightLight = [130, 151, 105];
        let normalHighLightDark = [100, 111, 64];

        let newChessBoard = new ChessBoard();
        let boardGraphicsManager = new BoardGraphicsManager(newChessBoard, normalDark, normalLight, normalHighLightLight, normalHighLightDark);
        //let boardGraphicsManager = new BoardGraphicsManager(newChessBoard,cherryDark,cherryLight,cherryHighlightLight,cherryHighlightDark);
        let roundManager = new RoundManager(newChessBoard);
        let roundDisplay = new RoundDisplay(roundManager);

        //set board and graphics managers 
        newChessBoard.setGraphicsManager(boardGraphicsManager);
        newChessBoard.setRoundManager(roundManager);
        //console.log(newChessBoard.toString());

        let enableStockFish = false;

        //make all images undraggable 
        document.querySelectorAll('img').forEach(img => {
                img.addEventListener('dragstart', (event) => {
                        event.preventDefault();
                });
        });

        //tree will be modified dynamically 
        let tree = new Treant(chart_config);
        let coordinator = new Coordinator(newChessBoard, boardGraphicsManager, roundManager, roundDisplay, enableStockFish,tree);

        //checkPawnQueenPromo(coordinator);
        royLopez(coordinator);

        getUserBoardInput(coordinator);




}

function royLopez(coordinator) {
        coordinator.modifyBoard("E2", "E4");
        coordinator.modifyBoard("E7", "E5");
        coordinator.modifyBoard("G1", "F3");
        coordinator.modifyBoard("B8", "C6");
        coordinator.modifyBoard("F1", "B5");
        coordinator.modifyBoard("D7", "D6");
}

function checkPawnQueenPromo(coordinator) {
        coordinator.modifyBoard("E2", "E4");
        coordinator.modifyBoard("E7", "E5");
        coordinator.modifyBoard("E4", "E7");
}

function checkTest(coordinator) {
        coordinator.modifyBoard("E2", "E4");
        coordinator.modifyBoard("E7", "E5");
        coordinator.modifyBoard("D2", "D4");
        coordinator.modifyBoard("F7", "D6");
}


main();