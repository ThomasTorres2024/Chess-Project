import ChessPiece from "/board/chess_pieces/chesspiece.js"
import ChessBoard from "/board/chessboard.js";
import {iterateUpwardRight,iterateDownwardRight,iterateOverRank,iterateOverFile} from "/board/boardutility.js"

//Queen Subclass
export default class Queen extends ChessPiece{

    constructor(boardSquare,color,board)
    {
        super(boardSquare,color,board);
        this.type = "queen";
        this.setBlackChar("♛")
        this.setWhiteChar("♕")

        //set bishop image 
        if (this.color == "white")
            {
                this.setImageName("/images/pieces/queen_white.png")
            }
        else{
                this.setImageName("/images/pieces/queen_black.png")
            }
    }

    //Determine moveable coords 
    defineMoveableAndHittableSquares()
    {
        super.defineMoveableAndHittableSquares();

        let file  = this.boardSquare[0];
        let rank  = parseInt(this.boardSquare[1]);

        let rankIterativeUpperRight = parseInt(rank)+1;
        let rankIterativeLowerRight = parseInt(rank)-1;
        let rankIterative = parseInt(rank)+1;
        let fileIterative = file.charCodeAt(0)+1;

        let board = this.getBoard();
        let rightUpwardIterator = board.getSquareAt(String.fromCharCode(fileIterative)+rankIterativeUpperRight);
        let rightDownwardIterator = board.getSquareAt(String.fromCharCode(fileIterative)+rankIterativeLowerRight);

        let vertIterated = board.getSquareAt(file+rankIterative);
        let horitzontlIterated = board.getSquareAt(String.fromCharCode(fileIterative)+rank);

        //iterateUpwardRight(rightUpwardIterator,board,this,fileIterative-1,rank,fileIterative,rankIterativeUpperRight,this.getMoveableSquares(),this.getTakeableSquares());
        iterateUpwardRight(rightUpwardIterator,board,this,fileIterative-1,rank,fileIterative,rankIterativeUpperRight,this.getMoveableSquares(),this.getTakeableSquares());
        iterateDownwardRight(rightDownwardIterator,board,this,fileIterative-1,rank,fileIterative,rankIterativeLowerRight,this.getMoveableSquares(),this.getTakeableSquares());
        
        iterateOverRank(vertIterated,board,this,file,rank,rankIterative,this.getMoveableSquares(),this.getTakeableSquares());
        iterateOverFile(horitzontlIterated,board,this,file,rank,fileIterative,this.getMoveableSquares(),this.getTakeableSquares());
    }
}