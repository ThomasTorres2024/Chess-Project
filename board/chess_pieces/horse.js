import ChessPiece from "/board/chess_pieces/chesspiece.js"
import ChessBoard from "/board/chessboard.js";
import { checkValidityPoints } from "/board/boardutility.js"
//Horse Subclass
export default class Horse extends ChessPiece {

    constructor(boardSquare, color, board) {
        super(boardSquare, color, board);
        this.type = "horse";
        this.setBlackChar("♞")
        this.setWhiteChar("♘")

        //set bishop image 
        if (this.color == "white") {
            this.setImageName("/images/pieces/horse_white.png")
        }
        else {
            this.setImageName("/images/pieces/horse_black.png")
        }

        this.setAlgebraicNotationSymbol("N");
        

    }

    //Determine moveable coords 
    defineMoveableAndHittableSquares() {
        super.defineMoveableAndHittableSquares();

        let file = this.boardSquare[0].charCodeAt(0);
        let rank = parseInt(this.boardSquare[1]);

        let moveableSquares = this.getMoveableSquares();
        let candidates = [];
        let takeableSquares = this.getTakeableSquares();

        //lower
        candidates.push(String.fromCharCode(file - 1) + (rank - 2));
        candidates.push(String.fromCharCode(file + 1) + (rank - 2));

        //left
        candidates.push(String.fromCharCode(file - 2) + (rank + 1));
        candidates.push(String.fromCharCode(file - 2) + (rank - 1));

        //right
        candidates.push(String.fromCharCode(file + 2) + (rank + 1));
        candidates.push(String.fromCharCode(file + 2) + (rank - 1));

        //there's def a smarter way to do this but i think this is fine, doing this cuz if rnk = 8, rank+2 = 10, and program interprets
        //this is as rank[1] = A1,B2, etc.
        if (parseInt(rank + 2) <= 8) {
            //upper
            candidates.push(String.fromCharCode(file - 1) + (rank + 2));
            candidates.push(String.fromCharCode(file + 1) + (rank + 2));
        }

        //console.log(candidates);
        checkValidityPoints(this, candidates, moveableSquares, takeableSquares)

    }
}