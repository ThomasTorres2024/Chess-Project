import BoardSquare from "/board/boardsquare.js"
import {BoardGraphicsManager} from "/board/graphics/boardfunctions.js"

//chess pieces 
import Pawn from "./chess_pieces/pawn.js";
import Rook from "./chess_pieces/rook.js"
import Bishop from "./chess_pieces/bishop.js"
import King from "./chess_pieces/king.js"
import Queen from "./chess_pieces/queen.js"
import Horse from "./chess_pieces/horse.js"
import Player from "/board/player.js"

export default class ChessBoard
{
    constructor()
    {
        this.rank = [1,2,3,4,5,6,7,8];
        this.file = ["A","B","C","D","E","F","G","H"];
        this.validPieceTypes = ["rook","pawn","horse","bishop","king","queen"]
        this.coordinateMap = new Map();

        this.blackIsChecked = false;
        this.whiteIsChecked = false; 

        this.blackIsCheckMated = false; 
        this.whiteIsCheckMated = false;

        this.whitePieces = new Set();
        this.blackPieces = new Set();

        this.setUpBoard();
        this.setUpPlayerPieces();
        this.graphicsManager=null;

        //Set Black King's Rooks
        this.blackKing = this.coordinateMap.get("E8").getPiece();
        this.blackKing.setKingSideRook(this.coordinateMap.get("H8"));
        this.blackKing.setQueenSideRook(this.coordinateMap.get("A8"));

        //Set White King's Rooks 
        this.whiteKing = this.coordinateMap.get("E1").getPiece();
        this.whiteKing.setKingSideRook(this.coordinateMap.get("H1"));
        this.whiteKing.setQueenSideRook(this.coordinateMap.get("A1"));

        //set up the 2 players 
        //this.whitePlayer = Player(true,true,null,[]);
        //this.blackPlayer = Player(false,true, null, []);
        this.foreCastAllValidMoves("white");
    }

    //Pop Piece, the intermediary that the chess board serves here is by going through the hash map to get the board coord instead of
    //just popping it directly  
    popPiece(boardCoord)
    {
        this.getCoordinateMap(boardCoord).removePiece();
    }

    //Performs a castle depending on it being king or queenside 
    castle(oldKingSquare,newKingSquare,oldRookSquare,newRookSquare,kingImage,rookImage)
    {   
        this.graphicsManager.swapPiece(oldKingSquare,newKingSquare,kingImage);
        this.graphicsManager.swapPiece(oldRookSquare,newRookSquare,rookImage);
        this.movePiece(oldKingSquare,newKingSquare);
        this.movePiece(oldRookSquare,newRookSquare)
    }

    //Move Piece to New Square
    movePiece(oldSquareCoord, newSquareCoord)
    {   
        let oldSquare = this.getCoordinateMap().get(oldSquareCoord);
        let oldPiece = this.getSquareAt(oldSquareCoord).getPiece();

        //
        //account for irregular moves/piece behavior, like pawns only being able to move 2 squares up once, castling,
        //and en passant
        if (oldPiece.getType() == "pawn")
        {
            oldPiece.setMoved(true);
        }
        else if (oldPiece.getType() == "king")
        {   

            oldPiece.setMoved(true);
        }

        //only move if the piece is in the set of moveable squares and the original square is filled, implying
        //it has a piece, and a valid square to move to.                    
        if (oldSquare.getFilled())
        {
            let newSquare = this.getCoordinateMap().get(newSquareCoord);

            //set piece from old square on new and remove piece on old square
            newSquare.setPiece(oldSquare.getPiece());
            oldSquare.removePiece();

            this.graphicsManager.swapPiece(oldSquare.getBoardCoords(),newSquare.getBoardCoords(),newSquare.getPiece().getImageName());
        }


        //update the position of the piece on the square 
        let piece = this.getCoordinateMap().get(newSquareCoord).getPiece();
        if(piece.getColor() == "white")
        {
            this.whitePieces.delete(oldSquareCoord);
            this.whitePieces.add(newSquareCoord);
        }
        else
        {
            this.blackPieces.delete(oldSquareCoord);
            this.blackPieces.add(newSquareCoord);
        }

        console.log("-----------------------------");
        piece.setBoardSquare(newSquareCoord.toString());
        // console.log(this.getCoordinateMap().get(newSquareCoord).getPiece());
        // console.log(this.whitePieces);
    }

    /**
     * Called after each round in order to determine if any checks, checkmates, or stalemates occurs, and checks what moves
     * are available 
     */
    postRound(colorPreviousMove)
    {   
        //define the scope for each piece after a move has been made, this is necessary to see what scare are being hit  
        this.foreCastAllValidMoves(colorPreviousMove); 

        //check if the previous player was checked
        this.determineAfterMoveIfPositionHasACheck(colorPreviousMove); 

        //get valid moves for all pieces of a certain color 
        if(colorPreviousMove == "white")
        {
            this.foreCastAllValidMoves("black");
        }
        else
        {
            this.foreCastAllValidMoves("white");
        }

        //if the piece is checked 
        if(this.blackIsChecked)
        {
            console.log("Black is checked, under construction");
        }
        else if(this.whiteIsChecked)
        {
            console.log("White is checked under construction");
        }
        
    }

    //Sets up the player pieces, adding white pieces to the white sets, and
    //Adds black pieces to the black set  
    setUpPlayerPieces()
    {

        //iterate over squares on the board with pieces 
        for(let i = 0; i < this.file.length; i++)
        {      
            //consists of all of the squares with 
            let character = this.file[i];
            let squares = [this.coordinateMap.get(character+(1)),this.coordinateMap.get(character+(2)),
                this.coordinateMap.get(character+(7)),this.coordinateMap.get(character+(8))
            ];

            //go through the squares which have pieces when the game starts by default 
            for(let j = 0; j < squares.length; j++)
            {
                let square = squares[j];
                if(square.getFilled())
                {   
                    let piece = square.getPiece();
                    let piecePosition = piece.getBoardSquare();
                    
                    //Add white pieces to white piece section
                    if(piece.getColor()=="white")
                    {
                        this.whitePieces.add(piecePosition);
                    }

                    //Add black pieces to black piece section
                    else 
                    {
                        this.blackPieces.add(piecePosition);
                    }
                }
            }
        }

        // console.log(this.whitePieces);
        // console.log(this.blackPieces);
    }

    //Sets up board according to laws of chess 
    setUpBoard()
    {      

        //A1-H1 and A8-H8 custom same, default pieces in order:
        //
        //A2-H2 pawns and A7-H7 pawns, pawns  where 2 rank --> white, 7 rank--> black
        
        //for pawns 
        let board = this;
        for (let i = 0; i<8;i++)
        {   
            //get file, the  a,b,c...h instance
            let file = this.getFile()[i];
            this.coordinateMap.set(file+(2),new BoardSquare(file+(2),this,new Pawn(file+2,"white",board)))
            this.coordinateMap.set(file+(7),new BoardSquare(file+(7),this,new Pawn(file+7,"black",board)))
            
            //squares with nothing in them, will add, if file[0] meaning a, A3,A4..A6 since nothing is contained
            //on these squares during set up
            for(let j =3; j<7;j++)
            {
                this.coordinateMap.set(file+(j),new BoardSquare(file+(j),this,null))
            }

        }

        //putting in pieces that can't be automated as well, i'll just do them manually
        this.coordinateMap.set("A8",new BoardSquare( "A8", this,new Rook("A8","black",board)))
        this.coordinateMap.set("H8",new BoardSquare( "H8", this,new Rook("H8","black",board)))
        this.coordinateMap.set("B8",new BoardSquare( "B8", this,new Horse("B8","black",board)))
        this.coordinateMap.set("G8",new BoardSquare( "G8", this,new Horse("G8","black",board)))
        this.coordinateMap.set("C8",new BoardSquare( "C8", this,new Bishop("C8","black",board)))
        this.coordinateMap.set("F8",new BoardSquare( "F8", this,new Bishop("F8","black",board)))
        this.coordinateMap.set("E8",new BoardSquare( "E8", this,new King("E8","black",board)))
        this.coordinateMap.set("D8",new BoardSquare( "D8", this,new Queen("D8","black",board)))
        this.coordinateMap.set("A1",new BoardSquare( "A1", this,new Rook("A1","white",this)))
        this.coordinateMap.set("H1",new BoardSquare( "H1", this,new Rook("H1","white",this)))
        this.coordinateMap.set("B1",new BoardSquare( "B1", this,new Horse("B1","white",this)))
        this.coordinateMap.set("G1",new BoardSquare( "G1", this,new Horse("G1","white",this)))
        this.coordinateMap.set("C1",new BoardSquare( "C1", this,new Bishop("C1","white",this)))
        this.coordinateMap.set("F1",new BoardSquare( "F1", this,new Bishop("F1","white",this)))
        this.coordinateMap.set("E1",new BoardSquare( "E1", this,new King("E1","white",this)))
        this.coordinateMap.set("D1",new BoardSquare( "D1", this,new Queen("D1","white",this)))

    }

   //Returns the black player object
   getBlackPlayer()
   {
       return this.blackPlayer;
   }

   //Returns the white player player object 
   getWhitePlayer()
   {
       return this.whitePlayer;
   }  

   //Changes the white player 
   setWhitePlayer(newPlayer)
   {
       this.whitePlayer=newPlayer;
   }

   //Changes the black player 
   setBlackPlayer(newPlayer)
   {
       this.blackPlayer = newPlayer;
   }

    //Setters
    setGraphicsManager(newGraphicsManager)
    {
        this.graphicsManager = newGraphicsManager;
    }

    //Getters

    getGraphicsManager()
    {
        return this.graphicsManager;
    }

    getCoordinateMap()
    {
        return this.coordinateMap;
    }

    //Made this to increase code readability it was getting annoying having to make 2 calls 
    getSquareAt(coord)
    {
        return this.coordinateMap.get(coord);
    }

    //Returns the list of rank, e.g. the column number
    getRank()
    {
        return this.rank
    }

    //Returns the file, the list of rows, of the chess board
    getFile()
    {
        return this.file
    }

    //Str Method to get str representation of the board for debugging 
    getChessBoardArrayWithCoords()
    {   
        let newArray = new Array(8).fill(null).map(() => new Array(8).fill(""));

        //element is expected to be a BoardSquare object
        function evaluateElement(element)
        {   
            //convert board coord to index of the 8,8 matrix, also swap coords to transpote matrix
            let y = element.getCartesianCoords()[1]/60
            let x = 7-element.getCartesianCoords()[0]/60
            
            newArray[x][y]=element.getBoardCoords();
           
        }
        this.getCoordinateMap().forEach(evaluateElement)

        return newArray;
    }

    toString()
    {   
        let newArray = new Array(8).fill(null).map(() => new Array(8).fill(""));

        //element is expected to be a BoardSquare object
        function evaluateElement(element)
        {   
            //console.log(element)

            //convert board coord to index of the 8,8 matrix
            let x = 7-element.getCartesianCoords()[1]/60
            
            let y = element.getCartesianCoords()[0]/60
            
            //console.log(element.getPiece().toString())

            newArray[x][y]=element.getBoardCoords();


            if (element.getFilled())
            {
                newArray[x][y]=element.getPiece().toString()
            }
            else
            {
                newArray[x][y]=" "
            }
           
        }
        this.getCoordinateMap().forEach(evaluateElement)

        return newArray;
    }


    //The user has 3 operating modes:
    //The flow of control for how the program will work will consider, on the first round we start at the unchecked mode, and then we move to the 
    //checked mode as the first thing checked for any given round 
    //Standard/unchecked 
    //Checked Mode 
    //Checkmated 

    //Checking Check Mate Procedure 
    //Idfc im doing a naive approach here hope to refine it later so im not checking all of the pieces
    //Loop through all opposing colored pieces, check their takeable squares, add these to a list too of total takeable squares
    //  Maybe to reduce run time I can have this as some kind of like list that perpetually grows, and I can sort it in some way
    //  to make search time less ass, order doesn't matter so maybe using a set will make this easier
    //If the king's square is in any of the pieces scope then the piece is checked, continue going through the rest of the pieces, return true
    //and the array will be updated

    //Needed to handle this:
    //Function to manage set's content
    //Way to efficiently search set/array if it is the same size ig? 
    //Update board graphics if the king is in check 
    //Array will be a new parameter for this class with its own getters and setters 
    //Needs some way to communicate with game coordinator to change game features 

    //Determine if the king is being checked 
    //Tbh with this solution I don't have an intuitively good way to go about the checking process, 
    //there are some things I can do to try and reduce the check time, but I think regardless of the type
    //of move, I will have to brute force check many pieces to see what I can move in an efficient manner.
    

    //If a piece of white just moved, we want to go through white's pieces, and check
    //if they intersect with black's king, and if a piece of black just moved, we 
    //want to check if black's pieces intersect with white's king 
    determineCheckOnBoard(color)
    {   

        //start by getting the white king 
        let king = this.blackKing;
        let pieces = this.whitePieces;
        //check if the king actually was white and then autocorrect if not
        if(color == "black")
        {
            king = this.whiteKing;
            pieces = this.blackPieces;
        }

        //get king position of the opposite color 
        let kingLocation = king.getBoardSquare();
        for(const value of pieces)
        {   
            let piece = this.coordinateMap.get(value).getPiece();
            //piece.defineMoveableAndHittableSquares();
            let possibleTakes = piece.getTakeableSquares();
            // console.log(piece);
            //console.log(possibleTakes);
            //go through the possible places that we can move to, set checked to be true,
            //and add piece to 
            for(let i = 0; i < possibleTakes.length; i++)
            {   
                //when white checks a black piece 
                if(possibleTakes[i] == kingLocation && color == "white")
                {
                    //console.log(value);
                    //console.log(piece.toString() + " caused a check");
                    return 0; 
                }
                //when black checks a white piece 
                else if (possibleTakes[i] == kingLocation && color == "black")
                {
                    //console.log(piece.toString() + " caused a check");
                    return 1;
                }
            }    
        }
        //return -1 if nothing happens
        return -1; 
    }


    /**
     * Forecast all valid moves for given color. Takes all pieces a color owns, and then checks their scope, takes the moves which do not
     * cause a check on the same color, and adds them to their list of moveable and takeable pieces respectively. 
     */
    foreCastAllValidMoves(color)
    {
        //iterate through the respective set, clone sets since the checking function for the pieces 
        //relies upon making moves  
        let playerSet; 
        if(color == "white")
        {
            playerSet= new Set(this.whitePieces);
            console.log("White");
        }
        else
        {
            playerSet= new Set(this.blackPieces);
            console.log("Black:")
        }

        for(const pieceCoord of playerSet)
        {
            //console.log(pieceCoord);
            const square = this.coordinateMap.get(pieceCoord)

            //Check to only process only squares that have pieces  
            if(square.getFilled())
            {
                //get piece if the square is filled
                const piece = square.getPiece();
                //Determine what squares the piece can access
                //Get the totality of places the square can go 
                piece.defineMoveableAndHittableSquares();
                const possibleMoves = piece.getMoveableSquares();
                const possibleTakes = piece.getTakeableSquares();
                let newPossibleMoves = [];
                let newTakeableMoves = [];
                let firstSquare = pieceCoord;

                //go through all of the possible moves and posisble takes, this will append elements
                //to the possible moves and takeable moves functions 
                for(let i = 0; i < possibleMoves.length; i++)
                {   
                    let newSquare = possibleMoves[i];
                    this.evaluateMove(firstSquare,newSquare,newPossibleMoves);
                }
                for(let j = 0; j < possibleTakes.length; j++)
                {
                    let newSquare=possibleTakes[j];
                    this.evaluateMove(firstSquare,newSquare,newTakeableMoves);
                }

                console.log("------------------------------")

                //Now that any moves which cause checks have been removed, this implies that we have a check 
                piece.setMoveableSquares(newPossibleMoves);
                piece.setTakeableSquares(newTakeableMoves);
            }
            else
            {
                console.log("ERROR. Tried to check the scope of a piece, " + square + " when there is no piece located at the square. ");
                console.log(pieceCoord);
                break;
            }
        }
    }

    /**
     * Modfies coordinate map with a possible move, and then checks if there is a check on the board by
     * returning false if there is a check, and true if there is no check then. Undoes the piece move 
     * instantly 
     */
    evaluateMove(oldSquareCoords,newSquareCoords, possibleSquare)
    {   
        let piece; 
        let newSquarePiece;
        let oldSquare = this.coordinateMap.get(oldSquareCoords);
        let newSquare = this.coordinateMap.get(newSquareCoords);

        if(oldSquare.getFilled())
        {
            //get piece, remove it from square set to the new square 
            piece=oldSquare.getPiece();
            newSquarePiece=newSquare.getPiece();
            let color = piece.getColor();

            //Swap values in the set 
            if(color == "white")
            {
                this.whitePieces.add(newSquareCoords);
                this.whitePieces.delete(oldSquareCoords);
            }
            else
            {
                this.blackPieces.add(newSquareCoords);
                this.blackPieces.delete(oldSquareCoords);
            }

            //swap values on board 
            oldSquare.removePiece();
            newSquare.setPiece(piece);
            let res = this.determineCheckOnBoard(color);
            console.log(res);
            console.log(color);

            //Undo board Swap
            newSquare.setPiece(newSquarePiece);
            oldSquare.setPiece(piece);

            //Undo Set Swap, if  
            if(color == "white")
            {
                this.whitePieces.add(oldSquareCoords);
                this.whitePieces.delete(newSquareCoords);
                if(res != 1)
                {
                    possibleSquare.push(newSquareCoords);  
                }
            }
            else
            {   
                this.blackPieces.add(oldSquareCoords);
                this.blackPieces.delete(newSquareCoords);
                if(res!=0)
                {
                    possibleSquare.push(newSquareCoords);
                }
            }

        }
        else
        {
            console.log("ERROR. Attempted to access an empty square: " + oldSquareCoords + ", new square: " + newSquareCoords);
            return; 
        }

    }

    /**
     * Takes the color of the attacking piece after a round, and determines if a check 
     * has been induced on the enemy king 
     * @param {Color of attacking piece} color 
     */
    determineAfterMoveIfPositionHasACheck(color)
    {   
        /*Function results in 0--> Black Check, 1 --> White Check, -1 No Changes on the board and 
        handles accordingly
        */
        let positionResult = this.determineCheckOnBoard(color);

        switch(positionResult)
        {
            case 1:
                console.log("White is checked");
                this.whiteIsChecked=true;
                break; 
            case 0:
                console.log("Black is checked.");
                this.blackIsChecked=true;
                break; 
            case -1: 
                console.log("No check,");
                this.blackIsChecked=false;
                this.whiteIsChecked=false;
                break; 
        }
    }

    /**
     * 
     * @param {the color of the player's turn} color 
     * @returns 
     */
    determineValidMoves(color)
    {

        //these contain all of the squares that the checked player can move to 
        let candidateSquares = new Set();

        //all of the places that the attacking pieces responsible for checking the king control 
        let controlledSquares = new Set(); 
        for(let i = 0; i < checkingPieces.length; i++)
        {
            let squares = checkingPieces.getMoveableSquares();
            for(let j = 0; j < squares.length; j++)
            {
                controlledSquares.add(square[j]);
            }
        }
        //console.log(controlledSquares);
        let kingPosition = checkedKing.getBoardSquare();

        //Get set of squares which are the union of the attacking pieces and put them in a set

        //Go through the checked player's pieces and check if: 
        //if king, check if the king can move to any square not controlled in the 
        
        return candidateSquares;
    }

    getDetermineIfKingIsCheckMated(kingPiece)
    {
        //Checks if a king is checkmated

        //Get available movement squares for king

        //Check if any opposing color pieces have these squares within their scope 

        //If the king has no moveable squares then remove them
    }

    //Returns if the black king is checked 
    getBlackKingChecked()
    {
        return this.blackIsChecked; 
    }

    //Returns if the white king is checked
    getWhiteKingChecked()
    {
        return this.whiteIsChecked;; 
    }

    //Determine if the king is check mated 
    getIsCheckMated()
    {

    }

}