export default class Round {

    //Creates a round object 
    constructor(previousRound, pieceOriginalPosition, pieceFinalPosition, board, count, turnColor, piece, taken_other_piece) {
        this.previousRound = previousRound;
        //set next round to null by default, must be changed after established 
        this.nextRound = null;

        this.pieceOriginalPosition = pieceOriginalPosition;
        this.pieceFinalPosition = pieceFinalPosition;

        this.taken_other_piece = taken_other_piece;

        this.board = board;
        this.count = count;
        this.turnColor = turnColor;

        if(this.piece){
            this.turnColor=this.piece.getColor();
        }

        this.blackChecked = false;
        this.whiteChecked = false;
        this.whiteCheckmated = false;
        this.blackCheckMated = false;
        this.drawn = false;

        this.piece = piece;
    }

    //Setters

    setBlackKingChecked(val) {
        this.blackChecked = val;
    }

    setWhiteKingChecked(val) {
        this.whiteChecked = val;
    }

    setWhiteKingCheckmated(val) {
        this.whiteCheckmated = val;
    }

    setBlackKingCheckMated(val) {
        this.blackCheckMated = val;
    }

    //Changes the next round
    setNextRound(nextRound) {
        this.nextRound = nextRound;
    }

    setDrawn(val) {
        this.drawn = val;
    }

    //Getters 

    //Returns the  previous round
    getPreviousRound() {
        return this.previousRound;
    }

    //Gets next round
    getNextRound() {
        return this.nextRound;
    }

    //Returns the final position of the piece 
    getPieceFinalPosition() {
        return this.pieceFinalPosition;
    }

    //Returns the original position of the piece
    getPieceOriginalPosition() {
        return this.pieceOriginalPosition;
    }

    //Returns count of the round
    getCount() {
        return this.count;
    }

    //Returns the board 
    getBoard() {
        return this.board;
    }

    //Returns the turn color
    //use move.getPiece().getColor() for more reliable piece color
    getTurnColor() {
        return this.turnColor;
    }

    //The chess piece used 
    getPiece() {
        return this.piece;
    }

    /**
     * Returns user's current move using Algebraic notation
     */
    getMoveAlgebraic() {
        let round_string = ""

        if (this.taken_other_piece) {
            //this is calculated in both cases so do it out here
            round_string = "x" + (this.pieceFinalPosition).toLowerCase();

            if (this.piece.getType() == "pawn") {
                round_string = this.pieceOriginalPosition[0].toLowerCase() + round_string;
            } else {
                round_string = this.piece.getAlgebraicNotationSymbol() + round_string;
            }
        }
        else {
            round_string = this.piece.getAlgebraicNotationSymbol() + (this.pieceFinalPosition).toLowerCase();
        }

        return round_string;

    }

    //Returns string representation of the round.
    toString() {
        const pieceSymbol = this.piece.toString();
        let round_string = ""


        if (this.drawn) {
            round_string = "0.5 - 0.5";
        }
        else if (this.taken_other_piece) {
            //this is calculated in both cases so do it out here
            round_string = "x" + (this.pieceFinalPosition).toLowerCase();

            if (this.piece.getType() == "pawn") {
                round_string = this.pieceOriginalPosition[0].toLowerCase() + round_string;
            } else {
                round_string = pieceSymbol + round_string;
            }
        }
        else {
            round_string = pieceSymbol + (this.pieceFinalPosition).toLowerCase();
        }

        //now for checks
        if (this.blackCheckMated || this.whiteCheckmated) {
            round_string += "#";
        }
        else if (this.blackChecked || this.whiteChecked) {
            round_string += "+";
        }


        return round_string;


    }

}