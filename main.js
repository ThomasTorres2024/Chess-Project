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
        console.log(newChessBoard.toString());

        let coordinator = new Coordinator(newChessBoard, boardGraphicsManager, roundManager, roundDisplay);

        //test for api here 

        // async function postChessApi(data = {}) {
        //         const response = await fetch("https://chess-api.com/v1", {
        //                 method: "POST",
        //                 headers: {
        //                         "Content-Type": "application/json"
        //                 },
        //                 body: JSON.stringify(data),
        //         });
        //         return response.json();
        // }

        // // 2. Execute:

        // //my string rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/3P1P2/PPP1N1PP/RNBQKB1R b KQkq -  1 4 

        // postChessApi({ fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1" }).then((data) => {
        //         console.log(data);
        // });

        // postChessApi({ fen: "8/1P1R4/n1r2B2/3Pp3/1k4P1/6K1/Bppr1P2/2q5 w - - 0 1" }).then((data) => {
        //         console.log(data);
        // });

        // // 3. You can provide text/html input to parse:
        // postChessApi({ input: document.querySelector('.moves-list').outerHTML }).then((data) => {
        //         console.log(data.eval);
        // });

        //checkPawnQueenPromo(coordinator);
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