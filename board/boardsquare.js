import {convertBoardPositionCartesian} from "./boardutility.js"

export default class BoardSquare
{
    constructor(coordinatesBoard, board, piece){


        //Assign coords and board  
        this.board = board;
        this.coordinatesBoard = coordinatesBoard;
        this.coordinatesCartesian = convertBoardPositionCartesian(this.coordinatesBoard);

        this.piece = piece
       
        //If square has a piece, designate filled or not
        if (this.piece)
        {
            this.filled = true;
        }
        else{
            this.filled = false;
        }

    }

    //Returns the chess piece on the square
    getPiece()
    {
        return this.piece;
    }


    //Returns Board Coordinates
    getBoardCoords()
    {
        return this.coordinatesBoard;
    }

    //Returns the board object linked to the square
    getBoardFromSquare()
    {
        return this.chessboard
    }

    //Returns Cartesian Coordinates of the Square
    getCartesianCoords()
    {
        return this.coordinatesCartesian;
    }

    //Returns if the square has been filled or not
    getFilled()
    {
        return this.filled;
    }
   
    //Setters
    setPiece(newPiece)
    {   
        if (newPiece != null)
        {   
            this.piece=newPiece;

            //if the piece is not filled, then fill it
            if (!this.filled)
                {
                    this.filled = true;
                }
        }

    }

    //Removes piece from the board ONLY if there is a piece on the square, and sets filled to false.
    removePiece()
    {
        if (this.filled)
        {
            this.piece=null;
            this.filled = false;
        }
    }

    //To String Method representing what the square is
    toStirng()
    {
        return this.coordinatesBoard;
    }

}