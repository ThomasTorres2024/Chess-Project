import ChessBoard from "/board/chessboard.js"
import BoardSquare from "/board/boardsquare.js"
import { generateBoard,swapPiece,visualizePieceScope} from "./board/graphics/boardfunctions.js";
import Rook from "/board/chess_pieces/rook.js"

function testPawn()
{       //Create a chessboard object 
        let newChessBoard = new ChessBoard();
        generateBoard(newChessBoard);
    
        let oldPos = "E2"
        let newPos = "H8"

        let secondOldVal = "F1" 
        let secondNewVal =  "A4"
        //newChessBoard.movePiece("F2","F4")
        //newChessBoard.movePiece("G1","F3")
        newChessBoard.movePiece(oldPos,newPos)
        let rookPointer = newChessBoard.getCoordinateMap().get(newPos).getPiece()
        console.log(rookPointer);
        //let secondPointer = newChessBoard.getCoordinateMap().get(secondNewVal).getPiece()
        rookPointer.defineMoveableAndHittableSquares()
        //secondPointer.defineMoveableAndHittableSquares()
        console.log("Moveable squares: " + rookPointer.getMoveableSquares());
        console.log("Takeable squares: " + rookPointer.getTakeableSquares());
        visualizePieceScope(rookPointer);
}



//Seems to pass everything
function testHorse()
{       //Create a chessboard object 
        let newChessBoard = new ChessBoard();
        generateBoard(newChessBoard);
    
        let oldPos = "B1"
        let newPos = "H1"

        let secondOldVal = "F1" 
        let secondNewVal =  "A4"
        //newChessBoard.movePiece("F2","F4")
        //newChessBoard.movePiece("G1","F3")
        newChessBoard.movePiece(oldPos,newPos)
        let rookPointer = newChessBoard.getCoordinateMap().get(newPos).getPiece()
        console.log(rookPointer);
        //let secondPointer = newChessBoard.getCoordinateMap().get(secondNewVal).getPiece()
        rookPointer.defineMoveableAndHittableSquares()
        //secondPointer.defineMoveableAndHittableSquares()
        console.log("Moveable squares: " + rookPointer.getMoveableSquares());
        console.log("Takeable squares: " + rookPointer.getTakeableSquares());
        visualizePieceScope(rookPointer);
}

//Seems to pass tests 
function testKing()
{
            //Create a chessboard object 
            let newChessBoard = new ChessBoard();
            generateBoard(newChessBoard);
        
            let oldPos = "E1"
            let newPos = "A1"
    
            let secondOldVal = "F1" 
            let secondNewVal =  "A4"
            //newChessBoard.movePiece("F2","F4")
            //newChessBoard.movePiece("G1","F3")
            newChessBoard.movePiece(oldPos,newPos)
            let rookPointer = newChessBoard.getCoordinateMap().get(newPos).getPiece()
            console.log(rookPointer);
            //let secondPointer = newChessBoard.getCoordinateMap().get(secondNewVal).getPiece()
            rookPointer.defineMoveableAndHittableSquares()
            //secondPointer.defineMoveableAndHittableSquares()
            console.log("Moveable squares: " + rookPointer.getMoveableSquares());
            console.log("Takeable squares: " + rookPointer.getTakeableSquares());
            visualizePieceScope(rookPointer);
}

//Seems to pass  tests  
function testQueen()
{
        //Create a chessboard object 
        let newChessBoard = new ChessBoard();
        generateBoard(newChessBoard);
    
        let oldPos = "D1"
        let newPos = "D1"

        let secondOldVal = "F1" 
        let secondNewVal =  "A4"
        //newChessBoard.movePiece("F2","F4")
        //newChessBoard.movePiece("G1","F3")
        newChessBoard.movePiece(oldPos,newPos)
        let rookPointer = newChessBoard.getCoordinateMap().get(newPos).getPiece()
        console.log(rookPointer);
        //let secondPointer = newChessBoard.getCoordinateMap().get(secondNewVal).getPiece()
        rookPointer.defineMoveableAndHittableSquares()
        //secondPointer.defineMoveableAndHittableSquares()
        console.log("Moveable squares: " + rookPointer.getMoveableSquares());
        console.log("Takeable squares: " + rookPointer.getTakeableSquares());
        visualizePieceScope(rookPointer);
     
}

//Seems to have passed  all
function testBishop()
{
        //Create a chessboard object 
        let newChessBoard = new ChessBoard();
        generateBoard(newChessBoard);
    
        let oldPos = "C1"
        let newPos = "C1"

        let secondOldVal = "F1" 
        let secondNewVal =  "A4"
        //newChessBoard.movePiece("F2","F4")
        //newChessBoard.movePiece("G1","F3")
        newChessBoard.movePiece(oldPos,newPos)
        //newChessBoard.movePiece(secondOldVal,secondNewVal)

        let rookPointer = newChessBoard.getCoordinateMap().get(newPos).getPiece()
        console.log(rookPointer);
        //let secondPointer = newChessBoard.getCoordinateMap().get(secondNewVal).getPiece()
        rookPointer.defineMoveableAndHittableSquares()
        //secondPointer.defineMoveableAndHittableSquares()
        console.log("Moveable squares: " + rookPointer.getMoveableSquares());
        console.log("Takeable squares: " + rookPointer.getTakeableSquares());
        visualizePieceScope(rookPointer);
        //visualizePieceScope(secondPointer);
        console.log(newChessBoard.toString());
}

//Appears to pass all cases
function testRook()
{
        //Create a chessboard object 
        let newChessBoard = new ChessBoard();
        generateBoard(newChessBoard);
    
        let oldPos = "H8"
        let newPos = "H8"
        // newChessBoard.movePiece("A2","A4")
        // newChessBoard.movePiece("A7","A5")
        // newChessBoard.movePiece("H2","H4")
        // newChessBoard.movePiece("B2","D7")
        newChessBoard.movePiece(oldPos,newPos)
    
        let rookPointer = newChessBoard.getCoordinateMap().get(newPos).getPiece()
        rookPointer.defineMoveableAndHittableSquares()
        console.log("Moveable squares: " + rookPointer.getMoveableSquares());
        console.log("Takeable squares: " + rookPointer.getTakeableSquares());
        visualizePieceScope(rookPointer);
        console.log(newChessBoard.toString());
}

function testRoyLopez(board)
{   

    swapPiece("E2","E4",board.getCoordinateMap().get("E2"))
}