import ChessPiece from "/board/chess_pieces/chesspiece.js"
import ChessBoard from "/board/chessboard.js";
import {iterateOverRank,iterateOverFile} from "/board/boardutility.js"

//Rook Subclass
export default class Rook extends ChessPiece{

    constructor(boardSquare,color,board)
    {   
        super(boardSquare,color,board);
        this.type = "rook";
        this.setBlackChar("♜")
        this.setWhiteChar("♖")

        //Set that the piece has been moved to false from the start
        this.setMoved(false);

        //assume piece is a kingside rook
        this.isKingSideRook = true; 

        //check to see if it is a queen side piece 
        if(this.getBoardSquare()[0] == "A")
        {
            this.isKingSideRook = false;
        }

        //set bishop
        if (this.color == "white")
        {
            this.setImageName("/images/pieces/rook_white.png")
        }
        else{
            this.setImageName("/images/pieces/rook_black.png")
        }
    }   

    //Return if the king has moved or not
    getMoved()
    {
        return this.hasMoved;
    }

    //Changes the value of has moved 
    setMoved(newHasMoved)
    {
        this.hasMoved = newHasMoved;
    }

    //sets the bool of the rook type
    settKingSideRook(setRookType)
    {
        this.isKingSideRook=setRookType;
    }

    //True --> King side Rook
    //False --> Queen side Rook
    getKingSideRookOrQueen()
    {
        return this.isKingSideRook;
    }

    //Determine moveable coords 
    defineMoveableAndHittableSquares()
    {   
        super.defineMoveableAndHittableSquares();

        //Check for pieces above, below, left, and right of current square 

        //get board coords as a str 
        //console.log(this.getBoardSquareObject())

        let file  = this.boardSquare[0];
        let rank  = this.boardSquare[1];

        let rankIterative = parseInt(rank)+1;
        let fileIterative = file.charCodeAt(0)+1;

        let board = this.getBoard();
        let vertIterated = board.getSquareAt(file+rankIterative);
        let horitzontlIterated = board.getSquareAt(String.fromCharCode(fileIterative)+rank);

        iterateOverRank(vertIterated,board,this,file,rank,rankIterative,this.getMoveableSquares(),this.getTakeableSquares());
        iterateOverFile(horitzontlIterated,board,this,file,rank,fileIterative,this.getMoveableSquares(),this.getTakeableSquares());
    }
}