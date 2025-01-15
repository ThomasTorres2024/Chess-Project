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

        this.kingSideRook = null;
        this.queenSideRook = null; 

        //the squares that the king can castle to 
        this.castleableSquares = [];

        //set bishop image 
        if (this.color == "white")
            {
                this.setImageName("/images/pieces/king_white.png")
            }
            else{
                this.setImageName("/images/pieces/king_black.png")
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

        let fileIterative = file-1;
        let moveableSquares = this.getMoveableSquares();
        let takeableSquares = this.getTakeableSquares();

        let squareIterative = this.getBoard().getSquareAt(this.boardSquare);

        let bottomRankIterative =rank-1 
        let upperRankiterative = rank+2
        let upperFileBound = file+2;
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
            let queensideFiles = ["D","C","B"]
            let totalSet = [kingsideFiles,queensideFiles];

            //Change rank value if color is black
            let rank=1; 
            if(this.getColor() == "black")
            {
                rank=8;
            }

            //iterate through both king and queenside 
            for(let i = 0; i<totalSet.length;i++)
            {   
                //get the iterated set, and asusme that all values are valid, temp set is for all squares that work
                let iterated = totalSet[i];
                let allValid = true;
                let temp = []

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

                //if all squares were valid concatenate the result
                if(allValid)
                {

                    for(let i = 0; i < temp.length; i++)
                    {
                        moveableSquares.push(temp[i]);
                        this.castleableSquares.push(temp[i]);
                    }
                    console.log(temp);
                }
            }

        }
    }
    
}