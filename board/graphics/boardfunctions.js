import ChessPiece from "/board/chess_pieces/chesspiece.js"
import ChessBoard from "/board/chessboard.js"
import {convertBoardPositionCartesian} from "/board/boardutility.js"
import { pointToColor } from "/board/boardutility.js";

class BoardGraphicsManager
{   
    //only needs the board 
    constructor(board,darkSquareColor,lightSquareColor,highlightLight,highlightDark)
    {
        this.board=board;

        //Vars for visualizing pieces on the site 
        this.isVisualizing=false;
        this.visualizedPiece = null;
        this.visualizedTakeableSquares = [];
        this.visualizedMoveableSquares = [];
        this.highlightedSquare = null;

        //For Coloring 
        this.darkSquareColor = darkSquareColor;
        this.lightSquareColor = lightSquareColor;
        this.highlightLight = highlightLight;
        this.highlightDark = highlightDark;

        this.generateBoard();
    }

    //adds a chess piece to the board at a point
    addPieceToBoard(point,imgsrc)
    {
        let pieceImage = document.getElementById(point);
        pieceImage.innerHTML = `<img src="${imgsrc}">`;
    }

    //Draws pieces onto a blank board
    //Assumes that every square has at most 1 piece
    generateBoard()
    {
        //get map of pieces and iterate through it, check if point has a piece, if it has a
        //piece get the piece's img and then add it to the board. 

        let boardMap = this.board.getCoordinateMap();
        const boardKeys = boardMap.keys();

        //this is a node, boardKey's node starts as undef, and this gives it a value 
        let boardKeysNode = boardKeys.next();

        //go through the map iterator as long as the value is defined
        while(boardKeysNode.value != null)
        {   
            //get piece value and the square value
            const pieceStr = boardKeysNode.value;
            const square = this.getBoard().getSquareAt(pieceStr);

            //check if board square is filled, if it is filled then add a piece to it with its properties 
            if(boardMap.get(pieceStr).getFilled())
            {   
                this.addPieceToBoard(square.getBoardCoords(),square.getPiece().getImageName())
            }

            //get next key
            boardKeysNode = boardKeys.next();
        }

    }

    //Piece Scope Visualizers 

    //Visualizes the takeable and moveable squares of a piece.
    visualizePieceScope(piece)
    {
        //if a piece has already been visualized, its squares that have changed the board must be removed 
        if(this.getIsVisualized())
        {
            this.devisualizePiece();    
        }

        this.setHighlightedSquare(piece.getBoardSquare())
        this.setVisualizedMoveableSquares(piece.getMoveableSquares());
        this.setVisualizedTakeableSquares(piece.getTakeableSquares());

        //highlight square in question
        this.highlightSquare(piece.getBoardSquare());

        this.getVisualizedMoveableSquares().forEach(this.hightlightMoveableSquare);

        for(let i = 0; i< this.getVisualizedTakeableSquares().length  ; i++)
        {   
            let point = this.getVisualizedTakeableSquares()[i]
            let imageDir = piece.getBoard().getSquareAt(point).getPiece().getTakeableName();
            this.highlightTakeableSquare(point,imageDir);
        }

        this.setIsVisualized(true);

    }

    //Removes the visulized piece's scope from the board
    devisualizePiece()
    {   
        //Remove Highlight
        this.removeHighlight()

        //get rid of moveable dots 

        for(let i = 0; i<this.getVisualizedMoveableSquares().length;i++)
        {   
            const square = this.getVisualizedMoveableSquares()[i];
            this.removePieceImageFromBoard(square);
        }

        for(let j = 0; j<this.getVisualizedTakeableSquares().length;j++)
        {
            const square = this.getVisualizedTakeableSquares()[j];
            const pic = this.getBoard().getSquareAt(square).getPiece().getImageName();
            this.addPieceToBoard(square,pic);
        }

        //after cleaning everything up, remove the piece which is being visualized. 
        this.setVisualizedPiece(null);
        this.visualizedMoveableSquares = [];
        this.visualizedTakeableSquares = [];

        //set visualization to false 
        this.setIsVisualized(false);


    }

    //Checks if any given square on the board is within the set of moveable or takebale squares
    checkIfMoveableOrTakeable(point)
    {   

        //check over moveable 
        for(let i = 0; i<this.visualizedMoveableSquares.length;i++ )
        {   

            if (point==this.visualizedMoveableSquares[i])
            {
                return true 
            }
        }

        //check over takeable 
        for(let i = 0; i<this.visualizedTakeableSquares.length;i++ )
        {

            if (point==this.visualizedTakeableSquares[i])
            {
                return true 
            }
        }

        //means that the point wasn't found in either of the sets. 
        return false 
    }

    //Removes piece from the board
    removePieceImageFromBoard(point)
    {
        let pieceImage = document.getElementById(point);
        pieceImage.innerHTML = "";

    }

    //Moves piece to new square 
    swapPiece(oldPoint,newPoint,newImgSrc)
    {
        this.removePieceImageFromBoard(oldPoint);
        this.addPieceToBoard(newPoint,newImgSrc)
    }

    //represents a piece taking another piece
    pieceTakesPiece(oldPoint, newPoint, newImgSrc)
    {   
        //free up old point 
        this.removePieceImageFromBoard(oldPoint);
        this.removePieceImageFromBoard(newPoint);

        //get the img at point
        this.addPieceToBoard(newPoint,newImgSrc)
    }

    //Changes the color of the square when a point is selected 
    hightlightMoveableSquare(point)
    {
        let pieceImage = document.getElementById(point);
        pieceImage.innerHTML = `<img src="/images/board_events/highlight_moveable_square.png">`;
    }

    //Removes highlight from point
    removeHighlight()
    {   //locally store highlighted square and remove it from the global program immediately 
        let highlightedSquare = this.getHighlightedSquare();
        this.setHighlightedSquare(null);

        let highLightedColor = pointToColor(highlightedSquare);

        //check if the square is light or dark, and then the color will be changed on the board 
        let color = `rgb(${this.darkSquareColor[0]},${this.darkSquareColor[1]},${this.darkSquareColor[2]})`;
        if((highLightedColor == "light"))
        {
            color = `rgb(${this.lightSquareColor[0]},${this.lightSquareColor[1]},${this.lightSquareColor[2]})`;
        }
        
        //Changes color at last 
        document.getElementById(highlightedSquare).style.backgroundColor = color;
    }

    //Highlights squares with takeable pieces
    highlightTakeableSquare(point,highlightImage)
    {   
        let pieceImage = document.getElementById(point);
        pieceImage.innerHTML = `<img src="${highlightImage}">`;
    }

    //highlights point light or dark green depending upon its darkness or brightness 
    highlightSquare(point)
    {   
        //color is light by default.
        let color = `rgb(${this.highlightLight[0]},${this.highlightLight[1]},${this.highlightLight[2]})`;

        //if the color is dark change the highlight color to dark. 
        if(pointToColor(point) == "dark" )
        {
            color = `rgb(${this.highlightDark[0]},${this.highlightDark[1]},${this.highlightDark[2]})`;
        } 
 
        document.getElementById(point).style.backgroundColor = color;
    }
    

    //Getters 

    //Returns square highlighted when a piece is selected by a user 
    getHighlightedSquare()
    {   
        return this.highlightedSquare;
    }

    //Returns the chess board object 
    getBoard()
    {
        return this.board;
    }

    //Returns the piece which is being visualized 
    getVisualizedPiece()
    {
        return this.visualizedPiece;
    }

    //returns if the piece's scope has been visualized
    getIsVisualized()
    {
        return this.isVisualizing;
    }

    //Returns the visualized moveable squares 
    getVisualizedMoveableSquares()
    {
        return this.visualizedMoveableSquares;
    }

    //Returns the takeable squares
    getVisualizedTakeableSquares()
    {
        return this.visualizedTakeableSquares;
    }

    //Setters

    //Sets the visualized moveable squares 
    setVisualizedMoveableSquares(visualizedMoveableSquares)
    {
        this.visualizedMoveableSquares = visualizedMoveableSquares;
    }
    
    //Sets the takeable squares
    setVisualizedTakeableSquares(visualizedTakeableSquares)
    {
        this.visualizedTakeableSquares = visualizedTakeableSquares;
    }

    //Sets the new highlighted square
    setHighlightedSquare(highlightedSquare)
    {
        this.highlightedSquare=highlightedSquare;
    }

    //Changes piece which is being visualized 
    setVisualizedPiece(visulizedPiece)
    {
        this.visulizedPiece = visulizedPiece;
    }

    //changes the status of visualization 
    setIsVisualized(isVisualizing)
    {
        this.isVisualizing=isVisualizing;
    }


}

export{BoardGraphicsManager}