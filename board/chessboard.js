import BoardSquare from "/board/boardsquare.js"
import {BoardGraphicsManager} from "/board/graphics/boardfunctions.js"

//chess pieces 
import Pawn from "./chess_pieces/pawn.js";
import Rook from "./chess_pieces/rook.js"
import Bishop from "./chess_pieces/bishop.js"
import King from "./chess_pieces/king.js"
import Queen from "./chess_pieces/queen.js"
import Horse from "./chess_pieces/horse.js"

export default class ChessBoard
{
    constructor()
    {
        this.rank = [1,2,3,4,5,6,7,8];
        this.file = ["A","B","C","D","E","F","G","H"];
        this.validPieceTypes = ["rook","pawn","horse","bishop","king","queen"]
        this.coordinateMap = new Map();
        this.setUpBoard();
        this.graphicsManager=null;

        //Set Black King's Rooks
        let blackKing = this.coordinateMap.get("E8").getPiece();
        blackKing.setKingSideRook(this.coordinateMap.get("H8"))
        blackKing.setQueenSideRook(this.coordinateMap.get("A8"))

        //Set White King's Rooks 
        let whiteKing = this.coordinateMap.get("E1").getPiece();
        blackKing.setKingSideRook(this.coordinateMap.get("H1"))
        blackKing.setQueenSideRook(this.coordinateMap.get("A1"))

    }

    //Piece 1 Takes Piece 2 

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

        oldPiece.setMoveableSquares([]);
        oldPiece.setTakeableSquares([]);

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

            //update the position of the piece on the square 
            let piece = this.getCoordinateMap().get(newSquareCoord).getPiece();
            piece.setBoardSquare(newSquareCoord.toString());
        }
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
}