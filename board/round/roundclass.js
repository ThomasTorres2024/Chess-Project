export default class Round{
    
    //Creates a round object 
    constructor(previousRound, pieceOriginalPosition,pieceFinalPosition, board,count,turnColor,piece)
    {
        this.previousRound =previousRound;
        //set next round to null by default, must be changed after established 
        this.nextRound = null;

        this.pieceOriginalPosition = pieceOriginalPosition;
        this.pieceFinalPosition = pieceFinalPosition;

        this.board = board;
        this.count = count;
        this.turnColor = turnColor;

        this.piece = piece;
    }

    //Setters

    //Changes the next round
    setNextRound(nextRound)
    {   
        this.nextRound=nextRound;
    }

    //Getters 

    //Returns the  previous round
    getPreviousRound()
    {
        return this.previousRound;
    }

    //Gets next round
    getNextRound()
    {
        return this.nextRound;
    }

    //Returns the final position of the piece 
    getPieceFinalPosition()
    {
        return this.pieceFinalPosition;
    }

    //Returns the original position of the piece
    getPieceOriginalPosition()
    {
        return this.pieceOriginalPosition;
    }

    //Returns count of the round
    getCount()
    {
        return this.count;
    }

    //Returns the board 
    getBoard()
    {
        return this.board;
    }

    //Returns the turn color
    getTurnColor()
    {
        return this.turnColor;
    }

    //The chess piece used 
    getPiece()
    {
        return this.piece;
    }

    //Returns string representation of the round.
    toString()
    {   
        const pieceSymbol = this.piece.toString();
        //return this.getPieceFinalPosition()
        return pieceSymbol+ this.getPieceFinalPosition();
        //return`${this.getPieceOriginalPosition()} ${this.getPiece().getPiece().toString()} ${this.getPieceFinalPosition()}`;
    }

}