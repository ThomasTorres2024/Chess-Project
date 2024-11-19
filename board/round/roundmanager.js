import Round from "/board/round/roundclass.js";
import ChessBoard from "/board/chessboard.js";
import CastleRound from "/board/round/castleround.js";

//Essentially a doubly linked list of rounds
export default class RoundManager
{

    constructor(board)
    {
        this.board = board;

        //head of the linked list
        this.roundHead = null;
        this.previousRound = null;

        //tail of the linked list 
        this.currentColor = "white";
        this.count = 1;

    }

    //Multiple functions in this class do essentially the same thing so the code used to describe these activities can be nicely reduced 
    createNewRoundCore()
    {   
        this.previousRound = this.roundHead;

        //change current color
        if (this.currentColor == "black")
        {   
            //new round has started increment 1
            this.currentColor = "white";
            this.count+=1;
        }
        else
        {
            this.currentColor = "black";
        }
    }

    //Adds a castle move into the move order 
    addCastle(kingOldSquare,kingNewSquare,rookOldSquare,rookNewSquare, king, rook)
    {   
        //preps for making a new round
        this.createNewRoundCore();
        //Creates a new round just for castling 
        this.roundHead = new CastleRound(this.previousRound, kingOldSquare,kingNewSquare, king, rookOldSquare, rookNewSquare, rook, this.board,this.count,this.turnColor)
    }

    //Adds an en passant into the move order 
    

    //Adds rounds by creating current round, and linking it to previous round
    addToRounds(oldSquare,newSquare,squareCoordobject)
    {   

        const piece= squareCoordobject.getPiece();

        //if the round head hasn't been established yet, establish it
        if(this.roundHead != null)
        {
            this.createNewRoundCore();
            this.roundHead = new Round(this.previousRound,oldSquare,newSquare,this.board,this.count,this.currentColor,piece);
        }
        else
        {
            //create prev round to start off, give it a pointer
            this.previousRound = new Round(null,oldSquare,newSquare,this.board,this.count,"white",piece);
            this.roundHead = this.previousRound;
            //change color 
            this.currentColor = "black";
        }

    }

    //Returns the string of the current round
    getCurrentRoundString()
    {
        return this.roundHead.toString();
    }

    //Returns the previous round
    getPreviousRound()
    {
        return this.previousRound;
    }

    //Reutrns the current round 
    getCurrentRound()   
    {
        return this.roundHead;
    }

    //Returns the current round color
    getRoundColor()
    {
        return this.currentColor;
    }


}