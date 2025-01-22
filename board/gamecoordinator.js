/**
 * Still need to add a checking function, the way this will be done is by recalculating every piece's scope
 * when the round ends for both black and white. 
 * 
 * So in the chessboard object, we will have a moveable squares 
 * Checking function will do a few things
 * -if checked the icon for the pice checked will be in red like on li chess
 * -any time a user's mouse input is processed, we will check for the condition of a check first 
 * and then allow routine game functionality to occur 
 */

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
        this.whiteChecked = false; 
        this.blackChecked = false;
        this.whiteCheckMated = false;
        this.blackCheckMated = false; 
        this.isDrawnByAgreement = false;
        this.isDrawnByStaleMate = false; 
        this.isDrawnByRepetition = false;

    }

    //Processes a move on the board, this function will be called and used extensively in this program.
    /*
    Begins by seeing if there is a check on the board, if there is a check processing is changed, 
    will try to evaluate if the check is a checkmate at first, and if it is not a checkmate, it will allow
    the player to continue the game. By default the checks are false. The modify board function makes calls to the 
    chessboard object, in the move piece function there will be another function to make checks,
    I will also ad a function for the visualization part to ensure a move will not put the player in 
    check 
    */
    processSquareMoveinput(pieceCoord)
    {   

        //get the square, and get the piece that we are either visualizing or want to visualize.
        let square=this.chessBoardVar.getSquareAt(pieceCoord);
        let pieceVisualized = this.boardGraphicsManager.getIsVisualized();
        
        //Display a victory message at the end for now it'll just be a message in console 
        if(this.blackCheckMated)
        {
            console.log("White wins.");
        }
        //White victory message 
        else if(this.whiteCheckMated)
        {
            console.log("Black wins.");
        }

        else if(this.isDrawnByStaleMate)
        {
            console.log("Drawn by stalemate.");
        }

        else if(this.isDrawnByRepetition)
        {
            console.log("Drawn by 3 fold repetition");
        }

        else if(this.isDrawnByAgreement)
        {
            console.log("Drawn by agreement");
        }

        //Return to this part later comment out for now 
        // else if(this.whiteChecked || this.blackChecked)
        // {
        //     console.log("A check has ocurred on: ");
        //     console.log(this.roundManager.getRoundColor());
        // }
        //a piece is already been displayed, check if the coordinate clicked is 
        else if(pieceVisualized && this.boardGraphicsManager.checkIfMoveableOrTakeable(pieceCoord))
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
                    
                    //Moves the king 
                    //if the king hasn't moved check if move was `castle` move 
                    if(!king.getMoved() && (newSquareCoord[0] == "G" || newSquareCoord[0] == "C"))
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
                        console.log(oldRookSquare);
                        this.castle(oldSquareCoord,newSquareCoord,oldRookSquare,newRookSquare,king,rook);
                    }

                    //Moves king if it has not moved before 
                    else
                    {
                        this.modifyBoard(oldSquareCoord,newSquareCoord);
                    }
                }

                //Check if piece is pawn, try and determine if the piece can do en passant or something 
                else if(piece.getType()=="pawn")
                {   
                    let pawnCoords = piece.getBoardSquare();

                    let rank = newSquareCoord[1];
                    //Check for Promotion
                    if(rank == "1" || rank == "8")
                    {
                        this.chessBoardVar.promoPawnToQueen(pawnCoords,newSquareCoord,"queen");
                    }

                    //if there are squares that can be enPassanted to
                    else if(piece.getEnPassantSquares().length > 0 && piece.getEnPassantSquares()[0] == newSquareCoord)
                    {
                        this.chessBoardVar.enPassant(piece);
                    }

                    //en passant for white 
                    this.modifyBoard(pawnCoords,newSquareCoord);
                    
                }

                //Moves piece types which are not kings 
                else
                {
                    //Move Piece
                    this.modifyBoard(oldSquareCoord,newSquareCoord);

                }
                console.log(this.chessBoardVar.toString())
                console.log(this.roundManager.getCurrentRound())
            }
    
            //If there is a piece on the square show the userr where it can go 
        else if(square.getFilled() && (this.roundManager.getRoundColor() == square.getPiece().getColor()))
        {
            const piece = square.getPiece();
            //console.log(piece);
            //UNCOMMENT FOR NORMAL FUNCTIONALITY 
            //piece.defineMoveableAndHittableSquares();
            this.boardGraphicsManager.visualizePieceScope(piece);
        }
    }



    //Standard move occurs on the board, takes piece's old square and new square and changes it 
    //The checking portion is done inside of the chessboard class, and is called when we move a piece,
    //once it is done executing we update the black and white checked variables
    modifyBoard(oldSquareCoord,newSquareCoord)
    {
        this.chessBoardVar.movePiece(oldSquareCoord,newSquareCoord);

        //determine if black or white is checked after this move
        this.roundManager.addToRounds(oldSquareCoord,newSquareCoord,this.chessBoardVar.getSquareAt(newSquareCoord));
        const move = this.roundManager.getCurrentRound();

        //adds the move just made to the board, where move is the move string and the round manager is a color corresponding to the color
        this.roundDisplay.addMoveStringDisplay(move,this.roundManager.getRoundColor())
        
        //COMMENT OUT FOR NORMAL FUNCTIONALITY
        //update what moves can be made for the next player and check status 
        let roundColor = this.chessBoardVar.getSquareAt(newSquareCoord).getPiece().getColor();
        this.chessBoardVar.postRound(roundColor);

        this.blackChecked=this.chessBoardVar.getBlackKingChecked();
        this.blackCheckMated=this.chessBoardVar.getBlackCheckMated();
        this.whiteCheckMated=this.chessBoardVar.getWhiteCheckMated();
        this.whiteChecked=this.chessBoardVar.getWhiteKingChecked();
        this.isDrawnByStaleMate=this.chessBoardVar.getStalemate();

        //Display the check if the pieces are checkmates 
        if(this.blackChecked)
        {
            console.log("Black checked.");
            this.boardGraphicsManager.highlightCheckedPiece(this.chessBoardVar.getBlackKing());
        }
        else if(this.whiteChecked)
        {
            console.log("White checked.");
            this.boardGraphicsManager.highlightCheckedPiece(this.chessBoardVar.getWhiteKing());
        }

        //Game Ending State Functions and continue game part
        if(this.isDrawnByStaleMate)
        {
            console.log("Game over by stalemate.")
        }
        else if(this.blackCheckMated)
        {
            console.log("Game over by black being checkmated")
        }
        else if(this.whiteCheckMated)
        {
            console.log("Game over by white being checkmated")
        }

        //Continue Game 
        else
        {
            //Undo any checks on pieces if they are no longer checked  
            if(!this.blackChecked)
            {
                this.boardGraphicsManager.dehighlightCheckedPiece(this.chessBoardVar.getBlackKing());
            }
            else if(!this.whiteChecked)
            {
                this.boardGraphicsManager.dehighlightCheckedPiece(this.chessBoardVar.getWhiteKing());
            }
        }

    }

    //Castles, performs a castle, adds castle info to the round, and add to display
    castle(oldSquareCoord,newSquareCoord,oldRookSquare,newRookSquare,king,rook)
    {   
        console.log(rook);

        //change board contents 
        this.chessBoardVar.castle(oldSquareCoord,newSquareCoord,oldRookSquare,newRookSquare,king.getImageName(),rook.getImageName());
        
        //set king moved and castle round 
        king.setMoved(true);
        rook.setMoved(true);
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