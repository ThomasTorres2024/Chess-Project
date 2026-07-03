import ChessPiece from "/board/chess_pieces/chesspiece.js"
import ChessBoard from "/board/chessboard.js";
import {iterateUpwardRight,iterateDownwardRight} from "/board/boardutility.js"


//Bishop Subclass
export default class Bishop extends ChessPiece{

    constructor(boardSquare,color,board)
    {
        super(boardSquare,color,board);
        this.type = "bishop";
        this.setBlackChar("♝")
        this.setWhiteChar("♗")

        //set bishop
        if (this.color == "white")
        {
            this.setImageName("/images/pieces/bishop_white.png")
        }
        else{
            this.setImageName("/images/pieces/bishop_black.png")
        }

        this.setAlgebraicNotationSymbol("B");

    }

    //Determine moveable coords, override parent function. 
    defineMoveableAndHittableSquares()
    {
        super.defineMoveableAndHittableSquares();

        let file  = this.boardSquare[0];
        let rank  = parseInt(this.boardSquare[1]);

        let rankIterativeUpperRight = parseInt(rank)+1;
        let rankIterativeLowerRight = parseInt(rank)-1;

        let fileIterative = file.charCodeAt(0)+1;

        let board = this.getBoard();
        let rightUpwardIterator = board.getSquareAt(String.fromCharCode(fileIterative)+rankIterativeUpperRight);
        let rightDownwardIterator = board.getSquareAt(String.fromCharCode(fileIterative)+rankIterativeLowerRight);

        //iterateUpwardRight(rightUpwardIterator,board,this,fileIterative-1,rank,fileIterative,rankIterativeUpperRight,this.getMoveableSquares(),this.getTakeableSquares());
        iterateUpwardRight(rightUpwardIterator,board,this,fileIterative-1,rank,fileIterative,rankIterativeUpperRight,this.getMoveableSquares(),this.getTakeableSquares());
        iterateDownwardRight(rightDownwardIterator,board,this,fileIterative-1,rank,fileIterative,rankIterativeLowerRight,this.getMoveableSquares(),this.getTakeableSquares());
    }

}