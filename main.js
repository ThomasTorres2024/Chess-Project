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

        let normalDark = [171, 128, 211];
        let normalLight = [240, 234, 229];
        let normalHighLightLight = [130, 151, 105];
        let normalHighLightDark = [100, 111, 64];

        let newChessBoard = new ChessBoard();
        let boardGraphicsManager = new BoardGraphicsManager(newChessBoard, normalDark, normalLight, normalHighLightLight, normalHighLightDark);
        // let boardGraphicsManager = new BoardGraphicsManager(newChessBoard,cherryDark,cherryLight,cherryHighlightLight,cherryHighlightDark);
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
        var default_treeant_config = {
                chart: {
                        container: "#collapsable-tree",

                        animateOnInit: true,

                        node: {
                                collapsable: true
                        },
                        animation: {
                                nodeAnimation: "easeOutBounce",
                                nodeSpeed: 700,
                                connectorsAnimation: "bounce",
                                connectorsSpeed: 700
                        }
                },
                nodeStructure: {
                        image:"images/pieces/horse_white.png"
                }
        };

        let tree = new Treant(default_treeant_config);
        let coordinator = new Coordinator(newChessBoard, boardGraphicsManager, roundManager, roundDisplay, enableStockFish, tree);

        //checkPawnQueenPromo(coordinator);
        // royLopez(coordinator);

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