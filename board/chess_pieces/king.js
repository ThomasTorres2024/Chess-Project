import ChessPiece from "/board/chess_pieces/chesspiece.js"
import ChessBoard from "/board/chessboard.js";
import Rook from "/board/chess_pieces/rook.js"

//King Subclass
export default class King extends ChessPiece{

    constructor(boardSquare,color,board)
    {
        super(boardSquare,color,board);
        this.type = "king";
        this.blackChar="♚"
        this.whiteChar="♔"
        this.hasMoved = false;

        this.kingSideRook;
        this.queenSideRook; 

        //the squares that the king can castle to 
        this.castleableSquares = [];

        this.canQueenSideCastle = false;
        this.canKingSideCastle = false; 

        this.setOfSquaresClearToCastleQueenSide;
        this.setOfSquaresClearToCastleKingSide;

        //If the king is checked or not 
        this.isChecked = false; 


        //set bishop image and set the set of pieces to be clear which is necessary to castle 
        if (this.color == "white")
            {
                this.setImageName("/images/pieces/king_white.png");
                this.setOfSquaresClearToCastleKingSide = new Set(["F1","G1"]);
                this.setOfSquaresClearToCastleQueenSide = new Set(["D1","C1","B1"]);
            }
            else{
                this.setImageName("/images/pieces/king_black.png");
                this.setOfSquaresClearToCastleKingSide = new Set(["F8","G8"]);
                this.setOfSquaresClearToCastleQueenSide = new Set(["D8","C8","B8"]);
            }
    }   

    //Returns the kingside rook
    getKingSideRook()
    {
        return this.kingSideRook;
    }

    //Gets the queenside rook
    getQueenSideRook()
    {
        return this.queenSideRook;
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

    //Sets the kingside rook
    setKingSideRook(newKingSideRook)
    {
        this.kingSideRook = newKingSideRook;
    }

    //Sets the queenside rook
    setQueenSideRook(newQueenSideRook)
    {
        this.queenSideRook = newQueenSideRook;
    }

    //Changes vals of castleable squares
    setCastleableSquares(newCastleableSquares)
    {
        this.castleableSquares=newCastleableSquares;
    }

    /**
     * Changes value for the piece being checked
     * @param {New boolean for if the piece is checked} newChecked 
     */
    setIsChecked(newChecked)
    {
        this.isChecked=newChecked;
    }

    /**
     * Returns if the king is checked 
     * @returns If the king is checked
     */
    getIsChecked()
    {
        return this.isChecked;
    }

    //Gets vals of castleable squares
    getCastleableSquares()
    {
        return this.castleableSquares;
    }

    //Determine moveable coords 
    defineMoveableAndHittableSquares()
    {
        super.defineMoveableAndHittableSquares();   

        //Check for pieces above, below, left, and right of current square 

        //get board coords as a str 

        let file  = this.boardSquare[0].charCodeAt(0);
        let rank  = parseInt(this.boardSquare[1]);
        this.castleableSquares=[];
        let fileIterative = file-1;
        let moveableSquares = this.getMoveableSquares();
        let takeableSquares = this.getTakeableSquares();

        let squareIterative = this.getBoard().getSquareAt(this.boardSquare);

        let bottomRankIterative =rank-1 
        let upperRankiterative = rank+2
        let upperFileBound = file+2;

        //set bounds for iteration
        if (fileIterative<65)
        {
            fileIterative = 65; 
        }

        if (upperFileBound > 72)
        {
            upperFileBound =73;
        }

        if(upperRankiterative > 8)
        {
            upperRankiterative = 9;
        }

        if(bottomRankIterative < 1)
        {
            bottomRankIterative = 1;
        }

        //iterate over files:
        for(let i = fileIterative;i<upperFileBound;i++)
        {

            for(let j = bottomRankIterative; j<upperRankiterative ;j++)
            {   
                squareIterative = this.getBoard().getSquareAt(String.fromCharCode(i)+j);
                
                //check if square is filled
                if(squareIterative.getFilled())
                {   
                    //if the pos is of opposing color, add to takeable. don't do anything otherwise add to takeable
                    if(squareIterative.getPiece().getColor()!=this.getColor())
                    {
                        takeableSquares.push(String.fromCharCode(i)+j);
                    }
                }
                else
                {
                    moveableSquares.push(String.fromCharCode(i)+j);
                }  
            }

        }

        //If the king has not moved, check if castling is possible. 
        if(!this.getMoved())
        {   
            //define king and queenside elements 
            let kingsideFiles = ["F","G"]
            let queensideFiles = ["D","C"]

            let kingSideList = this.processSide(kingsideFiles);
            let queenSideList = this.processSide(queensideFiles);

            //Check if the lists for queen side and king side castles have valid members, if the rook hasn't moved, and if the king is not
            //in a check currently 
            if(kingSideList.length > 0 && !this.kingSideRook.getMoved() && !this.getIsChecked())
            {
                this.canKingSideCastle=true;
                this.addMoveableSquares(kingSideList);
            }

            if(queenSideList.length > 0 && !this.queenSideRook.getMoved() && !this.getIsChecked())
            {
                this.canQueenSideCastle=true; 
                this.addMoveableSquares(queenSideList);
            }
        }
    }

    /**
     * Adds squares in a list to the moveable and castleable squares in the king's scope 
     * @param {The list of elements which can be moved to, use this if the kingside rook hasn't moved or if the queenside rook hasn't moved} moves 
     */
    addMoveableSquares(moves)
    {
        for(let i = 0; i < moves.length; i++)
            {
                this.moveableSquares.push(moves[i]);
                this.castleableSquares.push(moves[i]);
            }
    }

    /**
     * Processes the kingside and queenside files which a king could move to if they are clear 
     * @param {A list containing the files that need to be clear in order to perform a castle on the queen or kingside} iterated 
     * @returns A list with the squares that the king can move to if they do not have any pieces on the board blocking the king
     */
    processSide(iterated)
    {   
        //get the iterated set, and asusme that all values are valid, temp set is for all squares that work
        let allValid = true;
        let temp = []
        
        //Change rank value if color is black
        let rank=1; 
        if(this.getColor() == "black")
        {
            rank=8;
        }

        for(let j = 0; j<iterated.length;j++ )
        {   
            //get the square, check if the square is filled, if it is silled then do not cocatenate the sets 
            let square = this.getBoard().getSquareAt(iterated[j]+rank);
            if(square.getFilled())
            {
                allValid = false;
                break;
            }
            else
            {
                temp.push(iterated[j]+rank)
            }
        }
        
        //return if all squares necessary to castle are valid and also change the list passed in to be the list of squares
        return temp;
    }
    
}