import ChessPiece from "/board/chess_pieces/chesspiece.js"
import ChessBoard from "/board/chessboard.js";
import {cartesianToFileMap,fileToCartesianMap} from "/board/boardutility.js"

//Pawn subclass 
export default class Pawn extends ChessPiece{
    //Constructor 
    constructor(boardSquare,color,board)
    {
        super(boardSquare,color,board);
        this.setType("pawn");

        //important to check if the pawn can move 1 or 2 squares
        this.hasMoved = false; 
        this.enPassantAbleSquares = [];
        this.setBlackChar("♟")
        this.setWhiteChar("♙")

        //set bishop image 
        if (this.color == "white")
            {
                this.setImageName("/images/pieces/pawn_white.png")
            }
        else{
                this.setImageName("/images/pieces/pawn_black.png")
            }


    }

    //Changes if the pawn has been moved or not. 
    setMoved(hasMoved)
    {
        this.hasMoved = hasMoved;
    }

    //Returns if the piece has moved or not. 
    getMoved()
    {
        return this.hasMoved;
    }

    /**
     *Changes Squares which the pawn can en passant to 
     * @param {List of squares we can en passant to} newSquares 
     */
    setEnPassantSquares(newSquares)
    {
        this.enPassantAbleSquares=newSquares;
    }

    /**
     * Returns squares that can be enPassanted too
     * @returns en passantable squares 
     */
    getEnPassantSquares()
    {
        return this.enPassantAbleSquares;
    }

    /**
     * Adds en passant squares if a move satisfying en passant ocurred last move
     * @returns squares that contain pawns with a rank above where the pawns moved to
     */
    checkEnPassantSquares()
    {  

        this.setEnPassantSquares([]);

        if(!this.board.getRoundManager())
        {
            return;
        }


        let roundPrevious=this.board.getRoundManager().getCurrentRound();
        let pieceFinalPos = roundPrevious.getPieceFinalPosition();
        let pieceMoved = roundPrevious.getPiece();
        // console.log(pieceFinalPos);
        // console.log(pieceMoved)
        let availableSquares = [];

        let finalPieceFileAsNumber = fileToCartesianMap.get(pieceFinalPos[0]);
        let left = cartesianToFileMap.get(finalPieceFileAsNumber-60);
        let right = cartesianToFileMap.get(finalPieceFileAsNumber+60);
        
        //En passant for Black Conditions 
        if(this.getColor() == "black" && this.getBoardSquare()[1]=="4" && pieceMoved.getType() == "pawn" && pieceMoved.getColor() == "white" && pieceFinalPos[1] == "4" && ( left == this.getBoardSquare()[0]|| right == this.getBoardSquare()[0]))
        {
            this.enPassantAbleSquares.push(pieceFinalPos[0]+3);
            this.moveableSquares.push(pieceFinalPos[0]+3)
        }

        //En passant for white conditions
        else if(this.getColor() == "white" && this.getBoardSquare()[1]=="5" && pieceMoved.getType() == "pawn" && pieceMoved.getColor() == "black" && pieceFinalPos[1] == "5" && ( left == this.getBoardSquare()[0]|| right == this.getBoardSquare()[0]))
        {
            this.enPassantAbleSquares.push(pieceFinalPos[0]+6);
            this.moveableSquares.push(pieceFinalPos[0]+6);
        }

        return availableSquares
    }
    
    //Need to add a feature for en passant later 
    defineMoveableAndHittableSquares()
    {
        super.defineMoveableAndHittableSquares();
        let file  = this.boardSquare[0].charCodeAt(0);
        let rank  = parseInt(this.boardSquare[1]);
        
        let normalAhead = String.fromCharCode(file)+(rank+1);
        let unmovedAhead = String.fromCharCode(file)+(rank+2) 
        let leftTakeAble = String.fromCharCode(file-1)+(rank+1) 
        let rightTakebale = String.fromCharCode(file+1)+(rank+1) 

        //if black coords need to be obtained in another way
        if(this.getColor() == "black")
        {
            normalAhead = String.fromCharCode(file)+(rank-1);
            unmovedAhead = String.fromCharCode(file)+(rank-2) 
            leftTakeAble = String.fromCharCode(file-1)+(rank-1) 
            rightTakebale = String.fromCharCode(file+1)+(rank-1) 
        }


        let candidatesMoveble = [normalAhead];
        let candidatesTakeable = [leftTakeAble,rightTakebale];

        //if not moved there's a rule in chess to give the pawn 2 squares of movability 
        if (!this.getMoved())
        {
            candidatesMoveble.push(unmovedAhead);
        }
        function pawnMoveAbility(piece,pointList,moveableSquares)
        {
            for(let i = 0; i<pointList.length;i++)
                {
                    let file = pointList[i][0].charCodeAt(0);
                    let rank = parseInt(pointList[i][1]);
    
                    //if bounds are valid
                    if ((file < 73 && file >64) && (rank>0 && rank <9))
                    {   
                        let squareIterative  = piece.getBoard().getSquareAt(String.fromCharCode(file)+rank);
                        if(squareIterative.getFilled())
                        {   break;
                        }  
                        else
                        {
                            moveableSquares.push(String.fromCharCode(file)+rank); 
                        }
    
                    }
                }
        }

        //Check validity points
        function pawnTakeableEvaluation(piece,pointList,takeableSquares)
        {   
            for(let i = 0; i<pointList.length;i++)
            {
                let file = pointList[i][0].charCodeAt(0);
                let rank = parseInt(pointList[i][1]);

                //if bounds are valid
                if ((file < 73 && file >64) && (rank>0 && rank <9))
                {   
                    let squareIterative  = piece.getBoard().getSquareAt(String.fromCharCode(file)+rank);
                
                    if(squareIterative.getFilled() && (squareIterative.getPiece().getColor()!=piece.getColor()))
                    {   
                        takeableSquares.push(String.fromCharCode(file)+rank);
                    }  

                }
            }
        }

        let moveableSquares = this.getMoveableSquares();
        let takeableSquares = this.getTakeableSquares();

        //Add en passant squares before checking 
        this.checkEnPassantSquares();   

        pawnTakeableEvaluation(this,candidatesTakeable,takeableSquares);
        pawnMoveAbility(this,candidatesMoveble,moveableSquares);

        // console.log(this.moveableSquares)
        // console.log(this.takeableSquares)

        //process en passant 

    }
}