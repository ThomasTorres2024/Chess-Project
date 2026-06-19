import BoardSquare from "/board/boardsquare.js";
import ChessBoard  from "../chessboard.js";
import { pointToColor } from "/board/boardutility.js";

//Abstract  Class for a Chess Piece 
export default class ChessPiece{

    //Constructor 
    constructor(boardSquare,color,board)
    {   
        this.boardSquare = boardSquare;
        this.board = board 
        this.setColor(color);

        this.taken=false; 

        //by default set chars to be none just in case, to be modified in child
        //classes 
        this.blackChar="b"
        this.whiteChar="w"

        //image for the chess piece 
        this.imageName = ""
        this.elementId = ""

        //set of moveable positions
        this.moveableSquares = [];

        //set of positions which contain pieces that can be moved to
        this.takeableSquares = [];
    }

    //Sets moveabale squares 
    setMoveableSquares(newMoveableSquares)  
    {
        this.moveableSquares = newMoveableSquares;
    }

    setTakeableSquares(newTakeableSquares)
    {
        this.takeableSquares = newTakeableSquares;
    }

    //Changes the element id the piece corresponds to in the html doc 
    setElementId(newElementId)
    {
        this.elementId=newElementId;
    }

    //Set  White and Black Chars for The  String  Representation
    setBlackChar(newChar)
    {
        this.blackChar=newChar
    }

    setWhiteChar(newChar)
    {
        this.whiteChar=newChar
    }

    //changes where the piece is located 
    setBoardSquare(newBoardSquare)
    {
        this.boardSquare=newBoardSquare;
    }

    //Sets type
    setType(newType)
    {
        this.type = newType;
    }

    //Sets color
    setColor(newColor)
    {
        this.color = newColor;
    }

    //Sets image name
    setImageName(imageName)
    {
        this.imageName= imageName;
    }

    //returns the chess board object
    getBoard()
    {
        return this.board;
    }

    //returns the board square the piece is on
    getBoardSquareObject()
    {   
        return this.board.getCoordinateMap().get(this.boardSquare);
    }

    //returns the chess piece's image this
    getImageName()
    {
        return this.imageName;
    }

    //Gets file for takeable square
    getTakeableName()
    {   
        //dark by default, check if light, if light then change to light for the takebale name
        let squareColor = "dark"
        if(pointToColor(this.getBoardSquare()) == "light")
        {
            squareColor = "light";
        }
        return `/images/board_events/${this.type}_${this.color}_takeable_${squareColor}.png`
    }

    //returns the type of the piece, e.g. rook, horse etc 
    getType()
    {
        return this.type;
    }

    //Returns piece color
    getColor()
    {
        return this.color;
    }

    //Returns the chess coordinates of a piece ((A....H),(1....8))
    getBoardSquare()
    {
        return this.boardSquare;
    }

    //Returns an icon of the piece depending upon its color 
    toString()
    {   
        if (this.color == "black")
        {
            return this.whiteChar;
        }
        else
        {
            return this.blackChar;
        }
        
    }
    /**
     * Returns if the piece has been taken, and should no longer be accesed 
     * @returns if piece has been taken 
     */
    getTaken()
    {
        return this.taken
    }

    /**
     * Changes if the piece has been taken or not taken 
     * @param {New boolean value for Taken} newTaken 
     */
    setTaken(newTaken)
    {
        this.taken = newTaken;
    }


    //Outlines what the moveable squares are, and what pieces can be taken.
    defineMoveableAndHittableSquares()
    {   
        //in case this was already called reset everything to begin 
        this.moveableSquares = [];
        this.takeableSquares= []; 
    }

    /**
     * Function calls the define moveable and hittable function giving the lists of movebale 
     * and hittable squares, and then sees which of these moves will cause a check on the boardm
     * and which of these moves will cause 
     */
    defineValidMoveableAndTakeable()
    {

    }


    //Returns the chess coordinates of a list of squares which the current piece can be moved to 
    getMoveableSquares()
    {
        return this.moveableSquares;
    }

    getTakeableSquares()
    {
        return this.takeableSquares;
    }

}