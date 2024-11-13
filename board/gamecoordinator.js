//Game coordinator coordinates all of the pieces to visually represent the game and as well represent
//the rules of the game 

import {convertApproximateCoordsToBoard} from "/board/boardutility.js"
import {BoardGraphicsManager} from "/board/graphics/boardfunctions.js";
import RoundManager from "/board/round/roundmanager.js"
import RoundDisplay from "/round_display/round_display_graphics.js";
//Coordinates interactions between the chess board variable, graphics manager, and round manager 
export default class Coordinator 
{   
    //Sets cals for the chess board, the graphics manager for the board, the round manage,r and the round display manager 
    constructor(chessBoardVar, boardGraphicsManager, roundManager,roundDisplay)
    {
        this.chessBoardVar=chessBoardVar;
        this.boardGraphicsManager=boardGraphicsManager;
        this.roundManager=roundManager;
        this.roundDisplay = roundDisplay;
    }

    //Processes a move on the board, this function will be called and used extensively in this program
    processSquareMoveinput(pieceCoord)
    {   

        //get the square, and get the piece that we are either visualizing or want to visualize.
        let square=this.chessBoardVar.getSquareAt(pieceCoord);
        let pieceVisualized = this.boardGraphicsManager.getIsVisualized();
        
        //a piece is already been displayed, check if the coordinate clicked is 
        if(pieceVisualized && this.boardGraphicsManager.checkIfMoveableOrTakeable(pieceCoord))
            {   
                const oldSquareCoord = this.boardGraphicsManager.getHighlightedSquare();
                let piece = this.chessBoardVar.getSquareAt(oldSquareCoord).getPiece();
                const newSquareCoord = pieceCoord;
                this.boardGraphicsManager.devisualizePiece();
    
                //Check if the piece is a king or a pawn, there are unique conditions that need to be met for both of these types
                //if king, check if chosen move is a castle, otherwise the program will default to its normal routine
                if(piece.getType() == "king")
                {
                    let king = piece; 
                    
                    //all of this should be managed in a different way
                    
                    //if the king hasn't moved check if move was `castle` move 
                    if(!king.getMoved() && (newSquareCoord[0] == "G" || newSquareCoord == "C"))
                    {   
                        //set rank val
                        let rank = 1;
                        let oldFileRook = "A"
                        let newFileRook = "D";
                        if (king.getColor() == "black")
                        {
                            rank = 8;
                        }
    
                        if(newSquareCoord[0] == "G")
                        {
                            oldFileRook = "H";
                            newFileRook = "F";
                        }
                        
                        let oldRookSquare = oldFileRook+rank;
                        let newRookSquare = newFileRook+rank;
                        let rook = this.chessBoardVar.getSquareAt(oldRookSquare).getPiece();

                        this.castle(oldSquareCoord,newSquareCoord,oldRookSquare,newRookSquare,king,rook);
                    }
                    else
                    {
                        this.modifyBoard(oldSquareCoord,newSquareCoord);
                    }
                }
                else
                {
                    console.log(oldSquareCoord,newSquareCoord)
                    this.chessBoardVar.movePiece(oldSquareCoord,newSquareCoord);
                    //Add a new round to round  manager
                    this.roundManager.addToRounds(oldSquareCoord,newSquareCoord,this.chessBoardVar.getSquareAt(newSquareCoord))
                }
                console.log(this.chessBoardVar.toString())
                console.log(this.roundManager.getCurrentRound())
            }
    
            //If there is a piece on the square show the usefr where it can go 
            else if(square.getFilled() && (this.roundManager.getRoundColor() == square.getPiece().getColor()))
            {
                const piece = square.getPiece();
                piece.defineMoveableAndHittableSquares();
                this.boardGraphicsManager.visualizePieceScope(piece);
            }
    }

    //Standard move occurs on the board, takes piece's old square and new square and changes it 
    modifyBoard(oldSquareCoord,newSquareCoord)
    {
        this.chessBoardVar.movePiece(oldSquareCoord,newSquareCoord);
        this.roundManager.addToRounds(oldSquareCoord,newSquareCoord,this.chessBoardVar.getSquareAt(newSquareCoord));
        console.log(this.roundManager.getCurrentRound());
        //update the display for the rounds on the right side of the page 

        //console.log(this.roundManager.getCurrentRound().toString())

      //  this.roundDisplay.addMoveStringDisplay()

        
    }

    //Castles, performs a castle, adds castle info to the round, and add to display
    castle(oldSquareCoord,newSquareCoord,oldRookSquare,newRookSquare,king,rook)
    {   
        //change board contents 
        this.chessBoardVar.castle(oldSquareCoord,newSquareCoord,oldRookSquare,newRookSquare,king.getImageName(),rook.getImageName());
        
        //set king moved and castle round 
        king.setMoved(true);
        this.roundManager.addCastle(oldSquareCoord,newSquareCoord,oldRookSquare,newRookSquare, king, rook);  
    }

    //Performs En Passant 
    enPassant(pawnOldSquare,pawnNewSquare,opposingPawnNewSquare)
    {

    }

    //Reverses the events of the previous round on the board 
    reverseRound()
    {

    }

    //Advanced a round if the displayed round on the board is behind the current round 
    advanceRound()
    {

    }
}